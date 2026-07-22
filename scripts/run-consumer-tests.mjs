import { spawn, spawnSync } from 'node:child_process';
import { copyFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fixtureRoot = join(root, 'packages', 'migrate', 'test', 'consumers');
const publishable = {
    openvue: 'primevue',
    '@openvue/core': 'core',
    '@openvue/forms': 'forms',
    '@openvue/icons': 'icons',
    '@openvue/themes': 'themes',
    '@openvue/nuxt-module': 'nuxt-module',
    '@openvue/auto-import-resolver': 'auto-import-resolver',
    '@openvue/metadata': 'metadata',
    '@openvue/mcp': 'mcp',
    '@openvue/migrate': 'migrate'
};
const args = new Set(process.argv.slice(2));
const requested = process.argv.slice(2).find((arg) => !arg.startsWith('-'));
const keep = args.has('--keep');
const browser = args.has('--browser');
const skipBaseline = args.has('--skip-baseline');
const skipBuild = args.has('--skip-package-build');
const packOnly = args.has('--pack-only');
const workDirs = [];

function run(command, commandArgs, options = {}) {
    console.log(`\n> ${command} ${commandArgs.join(' ')}`);
    const timeout = options.timeout ?? Number(process.env.OPENVUE_TEST_COMMAND_TIMEOUT ?? 20 * 60_000);
    const result = spawnSync(command, commandArgs, {
        cwd: options.cwd ?? root,
        encoding: 'utf8',
        shell: process.platform === 'win32',
        stdio: options.capture ? 'pipe' : 'inherit',
        env: { ...process.env, ...options.env },
        timeout
    });

    if (result.error?.code === 'ETIMEDOUT') {
        if (process.platform === 'win32' && result.pid !== undefined) {
            spawnSync('taskkill', ['/pid', String(result.pid), '/T', '/F'], { shell: false, stdio: 'ignore' });
        }

        throw new Error(`${command} ${commandArgs.join(' ')} timed out after ${Math.round(timeout / 1000)} seconds`);
    }

    if (result.status !== 0) {
        if (options.capture) {
            process.stderr.write(result.stdout ?? '');
            process.stderr.write(result.stderr ?? '');
        }

        throw new Error(`${command} ${commandArgs.join(' ')} failed with exit code ${result.status}`);
    }

    return result.stdout?.trim() ?? '';
}

function walk(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        if (['node_modules', 'dist', '.nuxt', '.output', 'vendor'].includes(entry.name)) return [];
        const file = join(dir, entry.name);

        return entry.isDirectory() ? walk(file) : [file];
    });
}

function snapshot(dir) {
    return Object.fromEntries(walk(dir).map((file) => [relative(dir, file), readFileSync(file)]));
}

function assertSnapshotUnchanged(dir, before, label) {
    const after = snapshot(dir);
    const beforeNames = Object.keys(before).sort();
    const afterNames = Object.keys(after).sort();

    if (JSON.stringify(beforeNames) !== JSON.stringify(afterNames)) throw new Error(`${label}: the second migration changed the file set`);

    for (const name of beforeNames) {
        if (!before[name].equals(after[name])) throw new Error(`${label}: the second migration changed ${name}`);
    }
}

function packageCommand(manager, action) {
    if (manager === 'pnpm') return ['pnpm', action === 'install' ? ['install', '--no-frozen-lockfile'] : ['run', action]];

    return ['npm', action === 'install' ? ['install', '--no-audit', '--no-fund'] : ['run', action]];
}

function runPackage(manager, action, cwd) {
    const [command, commandArgs] = packageCommand(manager, action);

    run(command, commandArgs, { cwd });
}

function readPackage(dir) {
    return JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
}

function writePackage(dir, pkg) {
    writeFileSync(join(dir, 'package.json'), `${JSON.stringify(pkg, null, 4)}\n`);
}

function removeInstallState(dir) {
    for (const name of ['node_modules', 'package-lock.json', 'pnpm-lock.yaml']) rmSync(join(dir, name), { recursive: true, force: true });
}

function assertMigrated(dir, migrationVersion) {
    const pkg = readPackage(dir);
    const allDependencies = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.optionalDependencies, ...pkg.peerDependencies };

    if (allDependencies.primevue !== undefined) throw new Error(`${pkg.name}: primevue dependency survived migration`);
    if (allDependencies.openvue !== migrationVersion) throw new Error(`${pkg.name}: expected openvue@${migrationVersion}, received ${allDependencies.openvue}`);

    const alias = pkg.overrides?.primevue ?? pkg.pnpm?.overrides?.primevue ?? pkg.resolutions?.primevue;

    if (alias !== `npm:openvue@${migrationVersion}`) throw new Error(`${pkg.name}: compatibility alias is missing or incorrect`);

    const actionable = [];
    const reference = /(?:from\s*|import\s*\(|require\s*\()\s*['"`]primevue(?:\/|['"`])|['"`]@primevue\//;

    for (const file of walk(dir)) {
        if (!/\.(?:js|mjs|cjs|ts|tsx|vue)$/.test(file)) continue;
        const lines = readFileSync(file, 'utf8').split(/\r?\n/);

        lines.forEach((line, index) => {
            if (reference.test(line)) actionable.push(`${relative(dir, file)}:${index + 1}`);
        });
    }

    if (actionable.length > 0) throw new Error(`${pkg.name}: actionable PrimeVue references survived migration:\n${actionable.slice(0, 20).join('\n')}`);
}

function pointAtTarballs(dir, tarballs) {
    const pkg = readPackage(dir);

    pkg.devDependencies ??= {};

    for (const [name, tarball] of Object.entries(tarballs)) pkg.devDependencies[name] = `file:${tarball.replace(/\\/g, '/')}`;

    // The compatibility alias was asserted above. Local file dependencies cannot use npm's alias
    // protocol, so remove it only in this disposable install manifest.
    if (pkg.overrides) delete pkg.overrides.primevue;
    if (pkg.pnpm?.overrides) delete pkg.pnpm.overrides.primevue;
    if (pkg.resolutions) delete pkg.resolutions.primevue;

    writePackage(dir, pkg);
}

function assertLocalResolution(dir) {
    const lock = ['package-lock.json', 'pnpm-lock.yaml'].map((name) => join(dir, name)).find(existsSync);

    if (!lock) throw new Error(`${basename(dir)}: install did not create a lockfile`);

    const text = readFileSync(lock, 'utf8');

    if (/workspace:|link:/.test(text)) throw new Error(`${basename(dir)}: lockfile contains a workspace/link dependency`);
    if (/https?:[^\s"']*(?:\/openvue-|\/@openvue\/|\/openvue\/)/i.test(text)) throw new Error(`${basename(dir)}: an OpenVue package resolved from a remote registry`);

    for (const name of Object.keys(publishable)) {
        const packageFile = join(dir, 'node_modules', ...name.split('/'), 'package.json');

        if (!existsSync(packageFile)) throw new Error(`${basename(dir)}: locally packed ${name} is not installed`);
    }
}

async function waitForUrl(url, child) {
    for (let attempt = 0; attempt < 80; attempt++) {
        if (child.exitCode !== null) throw new Error(`preview server exited with ${child.exitCode}`);

        try {
            const response = await fetch(url);

            if (response.ok) return;
        } catch {}

        await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
    }

    throw new Error(`preview server did not become ready at ${url}`);
}

function stopPreview(child) {
    if (child.exitCode !== null || child.pid === undefined) return;

    if (process.platform === 'win32') {
        spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { shell: false, stdio: 'ignore' });
    } else {
        try {
            process.kill(-child.pid, 'SIGTERM');
        } catch {
            child.kill('SIGTERM');
        }
    }
}

function assertOverlayInViewport(box, viewport, label) {
    if (!box) throw new Error(`${label}: overlay has no browser layout box`);

    if (box.x < 0 || box.y < 0 || box.x + box.width > viewport.width || box.y + box.height > viewport.height) {
        throw new Error(`${label}: overlay is outside the ${viewport.width}x${viewport.height} viewport`);
    }
}

async function browserUmdSmoke(dir, instance) {
    const assets = {
        '/vue.js': readFileSync(join(dir, 'node_modules', 'vue', 'dist', 'vue.global.prod.js')),
        '/openvue.js': readFileSync(join(dir, 'node_modules', 'openvue', 'umd', 'openvue.min.js')),
        '/aura.js': readFileSync(join(dir, 'node_modules', '@openvue', 'themes', 'umd', 'aura.min.js'))
    };
    const html = `<!doctype html><html><body><div id="app"></div><script src="/vue.js"></script><script src="/openvue.js"></script><script src="/aura.js"></script><script>
        const Button = OpenVue.Button.default || OpenVue.Button;
        Vue.createApp({ render: () => Vue.h(Button, { label: 'UMD works' }) }).mount('#app');
        window.__openvueUmdReady = Boolean(Vue && OpenVue && OpenVue.Themes && OpenVue.Themes.Aura);
    </script></body></html>`;
    const server = createServer((request, response) => {
        if (request.url === '/') {
            response.setHeader('content-type', 'text/html; charset=utf-8');
            response.end(html);

            return;
        }

        const asset = assets[request.url];

        if (asset) {
            response.setHeader('content-type', 'text/javascript; charset=utf-8');
            response.end(asset);
        } else {
            response.statusCode = 404;
            response.end('Not found');
        }
    });

    await new Promise((resolvePromise, reject) => {
        server.once('error', reject);
        server.listen(0, '127.0.0.1', resolvePromise);
    });
    const address = server.address();
    const page = await instance.newPage();
    const errors = [];

    page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    try {
        await page.goto(`http://127.0.0.1:${address.port}`, { waitUntil: 'networkidle' });
        await page.getByRole('button', { name: 'UMD works' }).waitFor();
        const state = await page.evaluate(() => ({ ready: window.__openvueUmdReady, exports: Object.keys(window.OpenVue).length }));

        if (!state.ready || state.exports < 100) throw new Error(`UMD globals are incomplete (${state.exports} OpenVue exports)`);
        if (errors.length > 0) throw new Error(`UMD browser errors:\n${errors.join('\n')}`);
    } finally {
        await page.close();
        await new Promise((resolvePromise) => server.close(resolvePromise));
    }
}

async function browserSmoke(dir, fixture) {
    const pkg = readPackage(dir);
    const manager = pkg.openvueTest.packageManager;
    const port = 4300 + fixture.index;
    const [command, commandArgs] = pkg.openvueTest.server === 'laravel' ? ['php', ['artisan', 'serve', '--host=127.0.0.1', `--port=${port}`]] : packageCommand(manager, 'serve:test');
    const child = spawn(command, commandArgs, {
        cwd: dir,
        shell: process.platform === 'win32',
        detached: process.platform !== 'win32',
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, PORT: String(port), NITRO_PORT: String(port), OPENVUE_TEST_PORT: String(port) }
    });

    child.stdout.on('data', (chunk) => process.stdout.write(chunk));
    child.stderr.on('data', (chunk) => process.stderr.write(chunk));

    let instance;

    try {
        const url = `http://127.0.0.1:${port}`;

        await waitForUrl(url, child);

        if (fixture.name === 'nuxt') {
            const html = await (await fetch(url)).text();

            if (!html.includes('Nuxt migration contract')) throw new Error(`${pkg.name}: the initial response did not contain SSR-rendered application content`);
        }

        const { chromium } = await import('@playwright/test');

        instance = await chromium.launch();
        const page = await instance.newPage();
        const errors = [];

        page.on('console', (message) => {
            if (message.type() === 'error') errors.push(message.text());
        });
        page.on('pageerror', (error) => errors.push(error.message));
        page.on('requestfailed', (request) => errors.push(`${request.method()} ${request.url()}: ${request.failure()?.errorText ?? 'request failed'}`));
        page.on('response', (response) => {
            if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
        });
        await page.goto(url, { waitUntil: 'networkidle' });
        await page.locator('[data-testid="ready"]').waitFor();

        if (fixture.name === 'vite-manual') {
            const metadata = await import(pathToFileURL(join(dir, 'node_modules', '@openvue', 'metadata', 'index.mjs')).href);
            const icons = await import(pathToFileURL(join(dir, 'node_modules', '@openvue', 'icons', 'index.mjs')).href);
            const expectedIcons = Object.keys(icons).filter((name) => name.endsWith('Icon') && name !== 'BaseIcon').length;
            const componentCount = await page.locator('[data-openvue-component]').count();
            const iconCount = await page.locator('section[aria-label="OpenVue icon surface"] svg').count();

            if (componentCount !== metadata.components.length) throw new Error(`${pkg.name}: rendered ${componentCount}/${metadata.components.length} metadata components`);
            if (iconCount !== expectedIcons) throw new Error(`${pkg.name}: rendered ${iconCount}/${expectedIcons} OpenVue icons`);

            const styles = await page.evaluate(() => ({
                primeIcons: getComputedStyle(document.querySelector('.pi')).fontFamily.toLowerCase().includes('primeicons'),
                primeVueStyles: document.querySelectorAll('style[data-primevue-style-id]').length,
                themeVariables: Array.from(document.querySelectorAll('style')).some((style) => style.textContent?.includes('--p-primary-color'))
            }));

            if (!styles.primeIcons) throw new Error(`${pkg.name}: PrimeIcons font CSS was not applied`);
            if (styles.primeVueStyles === 0 || !styles.themeVariables) throw new Error(`${pkg.name}: styled theme CSS and variables were not injected`);
        }

        const toastButton = page.locator('[data-testid="show-toast"]');

        if ((await toastButton.count()) > 0) {
            await toastButton.click();
            const toastMessage = page.getByRole('alert').first();

            await toastMessage.waitFor();

            if (fixture.name === 'volt') {
                const [display, className] = await Promise.all([page.locator('[data-testid="ready"]').evaluate((element) => getComputedStyle(element).display), toastMessage.getAttribute('class')]);

                if (display !== 'grid') throw new Error(`${pkg.name}: Tailwind grid utility was not generated`);
                if (className?.split(/\s+/).includes('p-toast-message')) throw new Error(`${pkg.name}: unstyled Toast received styled-mode classes`);
                const expectedWrappers = readdirSync(join(dir, 'src', 'volt')).filter((name) => name.endsWith('.vue')).length;
                const wrapperText = await page.locator('[data-testid="volt-wrapper-count"]').innerText();

                if (!wrapperText.endsWith(String(expectedWrappers)) || expectedWrappers !== 69) {
                    throw new Error(`${pkg.name}: bundled ${wrapperText.match(/\d+$/)?.[0] ?? 0}/${expectedWrappers} Volt wrappers; expected the 69-wrapper surface`);
                }
            }
        }

        const confirmButton = page.locator('[data-testid="show-confirm"]');

        if ((await confirmButton.count()) > 0) {
            await confirmButton.click();
            const confirmDialog = page.locator('[role="alertdialog"], [role="dialog"]').first();

            await confirmDialog.waitFor();
            await page.keyboard.press('Escape');
            await confirmDialog.waitFor({ state: 'hidden' });
        }

        if (fixture.name === 'vite-manual') {
            const viewport = page.viewportSize();
            const confirmPopupButton = page.locator('[data-testid="show-confirm-popup"]');

            await confirmPopupButton.click();
            const confirmPopup = page.locator('[data-pc-name="confirmpopup"]').filter({ hasText: 'Does the popup work?' });

            await confirmPopup.waitFor();
            assertOverlayInViewport(await confirmPopup.boundingBox(), viewport, `${pkg.name} confirmation popup`);
            await confirmPopup.getByRole('button').first().click();
            await confirmPopup.waitFor({ state: 'hidden' });

            await page.locator('[data-testid="submit-form"]').click();
            await page.locator('[data-testid="form-error"]').waitFor();

            await page.getByRole('tab', { name: 'Data', exact: true }).click();
            const productTable = page.locator('[data-testid="product-table"]');
            const tableFilter = page.locator('[data-testid="table-filter"]');

            await tableFilter.fill('Zed');
            await productTable.getByText('Zed keyboard', { exact: true }).waitFor();
            await productTable.getByText('Alpha mouse', { exact: true }).waitFor({ state: 'hidden' });
            await tableFilter.fill('');
            await productTable.getByRole('columnheader', { name: 'Name' }).click();
            const firstProduct = (await productTable.locator('tbody tr').first().innerText()).trim();

            if (!firstProduct.startsWith('Alpha mouse')) throw new Error(`${pkg.name}: DataTable sorting did not put Alpha mouse first`);

            await page.locator('[data-testid="show-dialog"]').click();
            const staticDialog = page.locator('[role="dialog"]').filter({ hasText: 'Dialog content' });

            await staticDialog.waitFor();
            assertOverlayInViewport(await staticDialog.boundingBox(), viewport, `${pkg.name} dialog`);
            await page.keyboard.press('Escape');
            await staticDialog.waitFor({ state: 'hidden' });

            await page.locator('[data-testid="show-dynamic"]').click();
            const dynamicContent = page.locator('[data-testid="dynamic-dialog-content"]');

            await dynamicContent.waitFor();
            await page.keyboard.press('Escape');
            await dynamicContent.waitFor({ state: 'hidden' });

            await page.locator('[data-testid="show-popover"]').click();
            const popover = page.locator('[data-pc-name="popover"]').filter({ hasText: 'Positioned overlay' });

            await popover.waitFor();
            assertOverlayInViewport(await popover.boundingBox(), viewport, `${pkg.name} popover`);
            await page.keyboard.press('Escape');
            await popover.waitFor({ state: 'hidden' });
        }

        const inertiaLink = page.locator('a[href="/second"]');

        if ((await inertiaLink.count()) > 0) {
            await inertiaLink.click();
            await page.waitForLoadState('networkidle');
            await page.getByRole('heading', { name: /Second Inertia migration contract/ }).waitFor();
        }

        if (errors.length > 0) throw new Error(`${pkg.name}: browser console errors:\n${errors.join('\n')}`);
        if (fixture.name === 'vite-manual') await browserUmdSmoke(dir, instance);
    } finally {
        await instance?.close();
        stopPreview(child);
    }
}

async function packPackages() {
    const suppliedDir = process.env.OPENVUE_TEST_ARTIFACTS ? resolve(root, process.env.OPENVUE_TEST_ARTIFACTS) : packOnly ? join(root, 'test-artifacts') : null;
    const manifest = suppliedDir ? join(suppliedDir, 'manifest.json') : null;

    if (!packOnly && manifest && existsSync(manifest)) {
        return Object.fromEntries(Object.entries(readPackageSync(manifest)).map(([name, file]) => [name, resolve(suppliedDir, file)]));
    }

    if (!skipBuild) run('pnpm', ['run', 'build:test-packages']);

    const artifactDir = suppliedDir ?? mkdtempSync(join(tmpdir(), 'openvue-artifacts-'));

    mkdirSync(artifactDir, { recursive: true });
    if (!suppliedDir) workDirs.push(artifactDir);
    const tarballs = {};

    for (const [name, directory] of Object.entries(publishable)) {
        const output = run('pnpm', ['pack', '--pack-destination', artifactDir], { cwd: join(root, 'packages', directory), capture: true });
        const path = output
            .split(/\r?\n/)
            .find((line) => line.trim().endsWith('.tgz'))
            ?.trim();

        if (!path || !existsSync(path)) throw new Error(`Could not locate packed artifact for ${name} in output:\n${output}`);
        tarballs[name] = path;
    }

    writeFileSync(join(artifactDir, 'manifest.json'), `${JSON.stringify(Object.fromEntries(Object.entries(tarballs).map(([name, file]) => [name, basename(file)])), null, 4)}\n`);

    return tarballs;
}

function ensureMigrateCli() {
    const entry = join(root, 'packages', 'migrate', 'dist', 'index.js');

    if (!existsSync(entry)) run('pnpm', ['run', 'build:migrate']);

    return entry;
}

async function testFixture(name, index, tarballs, migrationVersion) {
    const source = join(fixtureRoot, name);

    if (!existsSync(source)) throw new Error(`Unknown consumer fixture: ${name}`);

    const dir = mkdtempSync(join(tmpdir(), `openvue-${name}-`));

    workDirs.push(dir);
    cpSync(source, dir, { recursive: true });
    const pkg = readPackage(dir);

    for (const copy of pkg.openvueTest.copy ?? []) cpSync(join(root, copy.from), join(dir, copy.to), { recursive: true });

    const manager = pkg.openvueTest.packageManager;

    if (existsSync(join(dir, 'composer.json'))) {
        for (const path of ['storage/framework/cache/data', 'storage/framework/sessions', 'storage/framework/views']) {
            mkdirSync(join(dir, path), { recursive: true });
        }

        run('composer', ['install', '--no-interaction', '--prefer-dist', '--no-progress'], { cwd: dir });
        if (!existsSync(join(dir, '.env'))) copyFileSync(join(dir, '.env.example'), join(dir, '.env'));
        run('php', ['artisan', 'key:generate', '--force'], { cwd: dir });
        run('php', ['artisan', 'route:list'], { cwd: dir });
    }

    console.log(`\n=== ${name}: PrimeVue baseline (${manager}) ===`);

    if (!skipBaseline) {
        runPackage(manager, 'install', dir);
        runPackage(manager, 'typecheck', dir);
        runPackage(manager, 'build', dir);
    }

    console.log(`\n=== ${name}: migrate to local OpenVue artifacts ===`);
    const migrateEntry = ensureMigrateCli();

    run(process.execPath, [migrateEntry, dir, '--force', '--no-install']);
    assertMigrated(dir, migrationVersion);
    const afterFirstMigration = snapshot(dir);

    run(process.execPath, [migrateEntry, dir, '--force', '--no-install']);
    assertMigrated(dir, migrationVersion);
    assertSnapshotUnchanged(dir, afterFirstMigration, pkg.name);
    removeInstallState(dir);
    pointAtTarballs(dir, tarballs);
    runPackage(manager, 'install', dir);
    assertLocalResolution(dir);
    runPackage(manager, 'typecheck', dir);
    runPackage(manager, 'build', dir);

    if (existsSync(join(dir, 'artisan'))) run('php', ['artisan', 'route:list'], { cwd: dir });

    if (browser) await browserSmoke(dir, { name, index });

    console.log(`=== ${name}: passed ===`);
}

const available = readdirSync(fixtureRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
const fixtures = requested ? [requested] : available;

let exitCode = 0;

try {
    const tarballs = await packPackages();
    const migrationVersion = readPackageSync(join(root, 'packages', 'migrate', 'package.json')).version;

    if (!packOnly) {
        for (let index = 0; index < fixtures.length; index++) await testFixture(fixtures[index], index, tarballs, migrationVersion);

        console.log(`\nConsumer suite passed for ${fixtures.length} fixture(s): ${fixtures.join(', ')}`);
    }
} catch (error) {
    console.error(error);
    exitCode = 1;
} finally {
    if (keep) console.log(`Preserved test directories:\n${workDirs.join('\n')}`);
    else workDirs.reverse().forEach((dir) => rmSync(dir, { recursive: true, force: true }));
}

process.exit(exitCode);

function readPackageSync(file) {
    return JSON.parse(readFileSync(file, 'utf8'));
}
