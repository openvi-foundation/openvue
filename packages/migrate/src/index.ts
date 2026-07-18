import { spawnSync } from 'node:child_process';
import { existsSync, realpathSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OPENVUE_VERSION } from './mappings';
import { migrate } from './migrate';

export { OPENVUE_VERSION, renameSpecifier } from './mappings';
export { auditResiduals, detectPackageManager, hasOpenVue, migrate } from './migrate';
export type { ChangedFile, MigrateMode, MigrateOptions, MigrateResult, ResidualReference } from './migrate';
export { addCompatAlias, rewritePackageJson, rewriteSource, rewriteWorkspaceYaml } from './rewrite';

const HELP = `openvue-migrate ${OPENVUE_VERSION}

Migrates a PrimeVue project to OpenVue in one run: rewrites package names in
package.json / pnpm-workspace.yaml and module specifiers in source files, adds
a package-manager override so third-party libraries that depend on primevue
resolve to OpenVue, and installs the migrated dependencies.

If OpenVue is already installed (found in package.json or node_modules), only
source files are rewritten — dependencies and node_modules are left untouched
and no install runs.

Usage:
  npx @openvue/migrate [dir] [options]

Options:
  --dry         Report what would change without writing any files
  --no-install  Skip the package manager install after rewriting
  --no-alias    Do not add the primevue -> openvue override to package.json
  --force       Run even if the git working tree has uncommitted changes
  --help        Show this help
  --version     Print the version
`;

const KNOWN_FLAGS = ['--dry', '--force', '--no-install', '--no-alias'];

const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const bold = (text: string) => (useColor ? `\x1b[1m${text}\x1b[0m` : text);
const green = (text: string) => (useColor ? `\x1b[32m${text}\x1b[0m` : text);
const yellow = (text: string) => (useColor ? `\x1b[33m${text}\x1b[0m` : text);

function isGitTreeDirty(dir: string): boolean {
    const inRepo = spawnSync('git', ['rev-parse', '--is-inside-work-tree'], { cwd: dir, encoding: 'utf8', shell: process.platform === 'win32' });

    if (inRepo.status !== 0 || inRepo.stdout.trim() !== 'true') return false;

    const status = spawnSync('git', ['status', '--porcelain'], { cwd: dir, encoding: 'utf8', shell: process.platform === 'win32' });

    return status.status === 0 && status.stdout.trim().length > 0;
}

function run(): number {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        console.log(HELP);

        return 0;
    }

    if (args.includes('--version') || args.includes('-v')) {
        console.log(OPENVUE_VERSION);

        return 0;
    }

    const dry = args.includes('--dry');
    const force = args.includes('--force');
    const install = !args.includes('--no-install');
    const alias = !args.includes('--no-alias');
    const unknownFlags = args.filter((arg) => arg.startsWith('-') && !KNOWN_FLAGS.includes(arg));

    if (unknownFlags.length > 0) {
        console.error(`Unknown option: ${unknownFlags[0]}\n\n${HELP}`);

        return 1;
    }

    const positional = args.filter((arg) => !arg.startsWith('-'));
    const dir = resolve(positional[0] ?? '.');

    if (!existsSync(dir) || !statSync(dir).isDirectory()) {
        console.error(`Not a directory: ${dir}`);

        return 1;
    }

    if (!dry && !force && isGitTreeDirty(dir)) {
        console.error(yellow('Your git working tree has uncommitted changes. Commit or stash them first so the migration is easy to review and revert, or re-run with --force.'));

        return 1;
    }

    console.log(bold(`openvue-migrate ${OPENVUE_VERSION}`) + (dry ? yellow(' (dry run — no files will be written)') : ''));
    console.log(`Migrating ${dir}\n`);

    const result = migrate({ dir, dry, alias });

    if (result.changedFiles.length === 0) {
        console.log('No PrimeVue references found — nothing to do.');
    } else {
        const total = result.changedFiles.reduce((sum, file) => sum + file.changes, 0);

        console.log(bold(`${dry ? 'Would rewrite' : 'Rewrote'} ${total} reference${total === 1 ? '' : 's'} in ${result.changedFiles.length} file${result.changedFiles.length === 1 ? '' : 's'}:`));

        for (const file of result.changedFiles) {
            console.log(green(`  ${file.file}`) + ` (${file.changes})`);

            for (const rename of file.renamed ?? []) {
                console.log(`      ${rename}`);
            }
        }
    }

    for (const note of result.notes) {
        console.log('\n' + `Note: ${note}`);
    }

    for (const warning of result.warnings) {
        console.log('\n' + yellow(`Warning: ${warning}`));
    }

    if (result.residuals.length > 0) {
        console.log('\n' + yellow(bold(`${result.residuals.length} PrimeVue reference${result.residuals.length === 1 ? '' : 's'} could not be rewritten automatically — review them:`)));

        for (const residual of result.residuals.slice(0, 25)) {
            console.log(yellow(`  ${residual.file}:${residual.line}`) + `  ${residual.text.slice(0, 120)}`);
        }

        if (result.residuals.length > 25) console.log(yellow(`  ...and ${result.residuals.length - 25} more.`));

        console.log("Some of these may be intentional (the Nuxt 'primevue' config key, docs, comments); anything that is an import or dependency needs a manual fix.");
    }

    if (result.failed) {
        console.error(yellow(bold('\nThe root package.json could not be rewritten — fix it (see warnings above) and re-run. Skipping the install so a broken migration is not masked.')));

        return 1;
    }

    if (result.changedFiles.length > 0 && !dry) {
        if (result.mode === 'sources-only') {
            console.log(bold('\nOpenVue is already installed — dependencies and node_modules were left untouched; only source files were rewritten.'));
        } else if (install) {
            console.log(bold(`\nRunning ${result.installCommand}...\n`));

            const installRun = spawnSync(result.installCommand, { cwd: dir, stdio: 'inherit', shell: true });

            if (installRun.status !== 0) {
                console.error(yellow(`\n${result.installCommand} failed — fix the install errors above and re-run it. The source migration itself is complete.`));

                return typeof installRun.status === 'number' ? installRun.status : 1;
            }

            console.log(bold('\nDone. Review the diff and run your build.'));
        } else {
            console.log(bold('\nNext step:'));
            console.log(`  Run: ${result.installCommand}`);
        }
    }

    return 0;
}

function isMainModule(): boolean {
    if (!process.argv[1]) return false;

    try {
        return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(resolve(process.argv[1]));
    } catch {
        return false;
    }
}

if (isMainModule()) process.exit(run());
