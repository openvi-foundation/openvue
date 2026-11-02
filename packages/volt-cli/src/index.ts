import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { add, listComponents, missingPackages } from './add';

export { add, listComponents, missingPackages } from './add';
export type { AddOptions, AddResult } from './add';

const HELP = `openvolt-vue ${version()}

Adds OpenVolt components to your project. The component files ship inside this
package, so the version you run always matches the openvue release it was
published with. Nothing is downloaded at run time.

Usage:
  npx openvolt-vue add <components...> [options]
  npx openvolt-vue add all [options]
  npx openvolt-vue list

Options:
  --outdir <dir>  Copy into <dir>/volt instead of src/volt
  --no-src-dir    Copy into ./volt instead of src/volt
  --no-deps       Do not copy the OpenVolt components the requested ones import
  --overwrite     Replace files that already exist (they are skipped by default)
  --help, -h      Show this help
  --version, -v   Print the version

Examples:
  npx openvolt-vue add Button
  npx openvolt-vue add DataTable Paginator
  npx openvolt-vue add --outdir app/components Dialog
`;

const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (code: number) => (text: string) => (useColor ? `\x1b[${code}m${text}\x1b[0m` : text);
const bold = paint(1);
const green = paint(32);
const yellow = paint(33);
const dim = paint(2);

function version(): string {
    return JSON.parse(readFileSync(fileURLToPath(new URL('../package.json', import.meta.url)), 'utf8')).version;
}

/** The bundled components in a published build, or the monorepo's apps/volt/volt when run from source. */
function sourceDir(): string {
    const bundled = fileURLToPath(new URL('./components', import.meta.url));

    return existsSync(bundled) ? bundled : fileURLToPath(new URL('../../../apps/volt/volt', import.meta.url));
}

function installCommand(dir: string, packages: string[]): string {
    const list = packages.join(' ');

    if (existsSync(join(dir, 'pnpm-lock.yaml'))) return `pnpm add ${list}`;
    if (existsSync(join(dir, 'yarn.lock'))) return `yarn add ${list}`;
    if (existsSync(join(dir, 'bun.lock')) || existsSync(join(dir, 'bun.lockb'))) return `bun add ${list}`;

    return `npm install ${list}`;
}

function run(argv: string[]): number {
    let parsed;

    try {
        parsed = parseArgs({
            args: argv,
            allowPositionals: true,
            options: {
                outdir: { type: 'string' },
                // Node 18's parseArgs has no built-in negation, so the --no-* flags are options of their own.
                'no-src-dir': { type: 'boolean' },
                'no-deps': { type: 'boolean' },
                overwrite: { type: 'boolean' },
                help: { type: 'boolean', short: 'h' },
                version: { type: 'boolean', short: 'v' }
            }
        });
    } catch (error) {
        console.error(`${error instanceof Error ? error.message : error}\n\n${HELP}`);

        return 1;
    }

    const { values, positionals } = parsed;
    const [command, ...names] = positionals;

    if (values.version) {
        console.log(version());

        return 0;
    }

    if (values.help || command === undefined) {
        console.log(HELP);

        return values.help ? 0 : 1;
    }

    if (command === 'list') {
        console.log(listComponents(sourceDir()).join('\n'));

        return 0;
    }

    if (command !== 'add') {
        console.error(`Unknown command: ${command}\n\n${HELP}`);

        return 1;
    }

    if (names.length === 0) {
        console.error(`Name at least one component, or "all".\n\n${HELP}`);

        return 1;
    }

    const cwd = process.cwd();
    const baseDir = values.outdir ? resolve(cwd, values.outdir) : values['no-src-dir'] ? cwd : join(cwd, 'src');
    const targetDir = join(baseDir, 'volt');
    const result = add(names, { sourceDir: sourceDir(), targetDir, deps: !values['no-deps'], overwrite: values.overwrite });
    const shown = relative(cwd, targetDir) || '.';

    for (const name of result.unknown) console.error(yellow(`Unknown component: ${name}. Run "npx openvolt-vue list" to see them all.`));

    if (result.added.length === 0 && result.skipped.length === 0) return 1;

    if (result.added.length > 0) {
        console.log(bold(`Added ${result.added.length} file${result.added.length === 1 ? '' : 's'} to ${shown}:`));
        for (const file of result.added) console.log(green(`  ${file}`));
    }

    if (result.dependencies.length > 0) console.log(dim(`Also added because they are imported: ${result.dependencies.join(', ')}`));

    if (result.skipped.length > 0) {
        console.log(yellow(`Skipped ${result.skipped.length} existing file${result.skipped.length === 1 ? '' : 's'} (pass --overwrite to replace): ${result.skipped.join(', ')}`));
    }

    const missing = missingPackages(cwd, result.packages);

    if (missing.length > 0) {
        console.log(`\nThese files import packages your package.json does not list. Install them with:\n  ${installCommand(cwd, missing)}`);
    }

    return result.unknown.length > 0 ? 1 : 0;
}

function isMainModule(): boolean {
    if (!process.argv[1]) return false;

    try {
        return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(resolve(process.argv[1]));
    } catch {
        return false;
    }
}

if (isMainModule()) process.exit(run(process.argv.slice(2)));
