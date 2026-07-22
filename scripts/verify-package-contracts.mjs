import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packages = ['primevue', 'core', 'forms', 'icons', 'themes', 'nuxt-module', 'auto-import-resolver', 'metadata', 'mcp', 'migrate'];
const failures = [];
let importedModules = 0;
const artifactDir = process.env.OPENVUE_TEST_ARTIFACTS ? resolve(root, process.env.OPENVUE_TEST_ARTIFACTS) : join(root, 'test-artifacts');
const artifactManifest = join(artifactDir, 'manifest.json');

if (!existsSync(artifactManifest)) {
    console.error(`Missing ${relative(root, artifactManifest)}. Run pnpm test:artifacts:pack first.`);
    process.exit(1);
}

const contractDir = mkdtempSync(join(tmpdir(), 'openvue-package-contract-'));
const packedDependencies = {
    ...Object.fromEntries(Object.entries(readJson(artifactManifest)).map(([name, file]) => [name, `file:${join(artifactDir, file).replace(/\\/g, '/')}`])),
    joi: '17.13.3',
    superstruct: '2.0.2',
    valibot: '1.2.0',
    yup: '1.4.0',
    zod: '3.23.8'
};

writeFileSync(join(contractDir, 'package.json'), `${JSON.stringify({ name: 'openvue-package-contract', private: true, type: 'module', dependencies: packedDependencies }, null, 4)}\n`);
const install = spawnSync('npm', ['install', '--no-audit', '--no-fund'], { cwd: contractDir, encoding: 'utf8', shell: process.platform === 'win32' });

if (install.status !== 0) {
    console.error(install.stdout);
    console.error(install.stderr);
    rmSync(contractDir, { recursive: true, force: true });
    process.exit(install.status ?? 1);
}

function fail(message) {
    failures.push(message);
}

function readJson(file) {
    return JSON.parse(readFileSync(file, 'utf8'));
}

function walk(dir) {
    if (!existsSync(dir)) return [];

    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const file = join(dir, entry.name);

        if (entry.name === 'node_modules') return [];

        return entry.isDirectory() ? walk(file) : [file];
    });
}

async function importModule(file) {
    try {
        await import(pathToFileURL(file).href);
        importedModules++;
    } catch (error) {
        fail(`${relative(root, file)} could not be imported: ${error instanceof Error ? error.message : error}`);
    }
}

for (const directory of packages) {
    const sourcePackage = join(root, 'packages', directory, 'package.json');
    const dist = join(root, 'packages', directory, 'dist');
    const distPackage = join(dist, 'package.json');

    if (!existsSync(distPackage) && !['nuxt-module', 'mcp', 'migrate'].includes(directory)) {
        fail(`${relative(root, distPackage)} is missing; build packages before running contracts`);
        continue;
    }

    const source = readJson(sourcePackage);
    const packed = readJson(join(contractDir, 'node_modules', ...source.name.split('/'), 'package.json'));

    if (source.name !== packed.name) fail(`${source.name}: dist package name is ${packed.name}`);
    if (source.version !== packed.version) fail(`${source.name}: source version ${source.version} does not match dist ${packed.version}`);

    const packageName = readJson(sourcePackage).name;
    const installedDist = join(contractDir, 'node_modules', ...packageName.split('/'));
    const entry = ['index.mjs', 'module.mjs', 'module.cjs', 'index.js'].map((name) => join(installedDist, name)).find(existsSync);

    if (entry && directory !== 'mcp') await importModule(entry);

    for (const file of walk(installedDist)) {
        if (!/index\.mjs$/.test(file) || file === entry) continue;

        const themeMatch = directory === 'themes' ? /[\\/](?:aura|lara|material|nora)[\\/]([^\\/]+)[\\/]index\.mjs$/.exec(file) : null;
        const typeFile = themeMatch ? join(installedDist, 'types', themeMatch[1], 'index.d.ts') : file.replace(/\.mjs$/, '.d.ts');

        if (!existsSync(typeFile)) fail(`${relative(root, file)} has no matching index.d.ts`);
        await importModule(file);
    }
}

const metadata = await import(pathToFileURL(join(contractDir, 'node_modules', '@openvue', 'metadata', 'index.mjs')).href);

for (const component of metadata.components) {
    const from = component.from ?? `openvue/${component.name.toLowerCase()}`;
    const match = /^(@openvue\/forms|openvue)\/(.+)$/.exec(from);

    if (!match) {
        fail(`metadata component ${component.name} has unexpected source ${from}`);
        continue;
    }

    const directory = match[1] === 'openvue' ? 'primevue' : 'forms';
    const entry = join(root, 'packages', directory, 'dist', match[2], 'index.mjs');

    if (!existsSync(entry)) fail(`metadata component ${component.name} points at missing ${relative(root, entry)}`);
}

const manualSurface = readFileSync(join(root, 'packages', 'migrate', 'test', 'consumers', 'vite-manual', 'src', 'surface.ts'), 'utf8');

for (const component of metadata.components) {
    const primeVueSource = component.from?.startsWith('@openvue/forms/') ? component.from.replace('@openvue/', '@primevue/') : `primevue/${component.name.toLowerCase()}`;

    if (!manualSurface.includes(`'${primeVueSource}'`)) fail(`Vite manual surface does not import metadata component ${component.name} from ${primeVueSource}`);
}

for (const item of [...metadata.directives, ...metadata.composables]) {
    const match = /^openvue\/(.+)$/.exec(item.from);

    if (!match || !existsSync(join(root, 'packages', 'primevue', 'dist', match[1], 'index.mjs'))) fail(`metadata entry ${item.as} points at missing ${item.from}`);
}

const installedIcons = join(contractDir, 'node_modules', '@openvue', 'icons');
const iconDirectories = readdirSync(installedIcons, { withFileTypes: true }).filter((entry) => entry.isDirectory() && existsSync(join(installedIcons, entry.name, 'index.mjs')));
const iconIndex = await import(pathToFileURL(join(installedIcons, 'index.mjs')).href);

if (Object.keys(iconIndex).length < iconDirectories.length) fail(`icon root exports ${Object.keys(iconIndex).length} values for ${iconDirectories.length} icon entry points`);

for (const preset of ['aura', 'lara', 'material', 'nora']) {
    const presetRoot = join(contractDir, 'node_modules', '@openvue', 'themes', preset, 'index.mjs');
    const umd = join(contractDir, 'node_modules', '@openvue', 'themes', 'umd', `${preset}.min.js`);

    if (!existsSync(presetRoot)) fail(`missing theme preset ${preset}`);
    if (!existsSync(umd) || statSync(umd).size < 1000) fail(`missing or empty theme UMD ${preset}`);
    else {
        try {
            new vm.Script(readFileSync(umd, 'utf8'), { filename: umd });
        } catch (error) {
            fail(`theme UMD ${preset} is not valid JavaScript: ${error instanceof Error ? error.message : error}`);
        }
    }
}

const openVueUmd = join(contractDir, 'node_modules', 'openvue', 'umd', 'openvue.min.js');

if (!existsSync(openVueUmd) || statSync(openVueUmd).size < 10000) fail('OpenVue UMD bundle is missing or unexpectedly small');
else {
    try {
        new vm.Script(readFileSync(openVueUmd, 'utf8'), { filename: openVueUmd });
    } catch (error) {
        fail(`OpenVue UMD bundle is not valid JavaScript: ${error instanceof Error ? error.message : error}`);
    }
}

async function smokeMcp() {
    const entry = join(contractDir, 'node_modules', '@openvue', 'mcp', 'dist', 'index.js');

    const fallbackEntry = join(contractDir, 'node_modules', '@openvue', 'mcp', 'index.js');
    const executable = existsSync(entry) ? entry : fallbackEntry;

    if (!existsSync(executable)) return fail('MCP dist entry is missing');

    await new Promise((resolvePromise) => {
        const child = spawn(process.execPath, [executable], { cwd: root, stdio: ['pipe', 'pipe', 'pipe'] });
        let output = '';
        let errorOutput = '';
        let settled = false;
        const finish = (message) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            child.kill();
            if (message) fail(message);
            resolvePromise();
        };
        const timer = setTimeout(() => finish(`MCP server did not answer initialize; stdout: ${output.slice(0, 300)}`), 5000);

        child.stdout.on('data', (chunk) => {
            output += chunk.toString();
            if (output.includes('"jsonrpc":"2.0"') && output.includes('"result"')) finish();
        });
        child.stderr.on('data', (chunk) => (errorOutput += chunk.toString()));
        child.on('error', (error) => finish(`MCP server failed to start: ${error.message}`));
        child.on('exit', (code) => {
            if (!settled) finish(`MCP server exited with ${code}; stdout: ${output.slice(0, 300)}; stderr: ${errorOutput.slice(0, 500)}`);
        });
        child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'openvue-contract', version: '1' } } })}\n`);
    });
}

await smokeMcp();

const migrateEntry = join(contractDir, 'node_modules', '@openvue', 'migrate', 'dist', 'index.js');
const migrateExecutable = existsSync(migrateEntry) ? migrateEntry : join(contractDir, 'node_modules', '@openvue', 'migrate', 'index.js');

for (const flag of ['--help', '--version']) {
    const result = spawnSync(process.execPath, [migrateExecutable, flag], { cwd: root, encoding: 'utf8' });

    if (result.status !== 0 || result.stdout.trim().length === 0) fail(`migrate CLI ${flag} smoke failed: ${result.stderr || `exit ${result.status}`}`);
}

for (const version of ['3.53.1', '5.0.0']) {
    const rejectedDir = mkdtempSync(join(tmpdir(), `openvue-rejected-v${version[0]}-`));
    const packageJson = `${JSON.stringify({ name: 'rejected-migration', private: true, dependencies: { primevue: version } }, null, 4)}\n`;
    const source = "import Button from 'primevue/button';\n";

    writeFileSync(join(rejectedDir, 'package.json'), packageJson);
    writeFileSync(join(rejectedDir, 'app.ts'), source);
    const result = spawnSync(process.execPath, [migrateExecutable, rejectedDir, '--force', '--no-install'], { cwd: root, encoding: 'utf8' });

    if (result.status === 0) fail(`migrate CLI accepted unsupported PrimeVue ${version}`);
    if (result.stdout.includes('nothing to do')) fail(`migrate CLI printed a success line for rejected PrimeVue ${version}`);
    if (readFileSync(join(rejectedDir, 'package.json'), 'utf8') !== packageJson || readFileSync(join(rejectedDir, 'app.ts'), 'utf8') !== source) {
        fail(`migrate CLI mutated a rejected PrimeVue ${version} project`);
    }
    rmSync(rejectedDir, { recursive: true, force: true });
}

if (failures.length > 0) {
    console.error(`Package contracts failed with ${failures.length} problem(s):`);
    failures.forEach((failure) => console.error(`  - ${failure}`));
    rmSync(contractDir, { recursive: true, force: true });
    process.exit(1);
}

console.log(`Package contracts passed: ${packages.length} packages, ${importedModules} ESM entry points, ${metadata.components.length} components, ${iconDirectories.length} icons, 4 themes, and MCP stdio.`);
rmSync(contractDir, { recursive: true, force: true });
