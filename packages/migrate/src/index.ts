import { spawnSync } from 'node:child_process';
import { existsSync, realpathSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as prompts from '@clack/prompts';
import pc from 'picocolors';
import { OPENVUE_VERSION } from './mappings';
import { migrate, MigrateResult } from './migrate';

export { OPENVUE_VERSION, renameSpecifier } from './mappings';
export { auditResiduals, detectPackageManager, hasOpenVue, migrate } from './migrate';
export type { ChangedFile, MigrateMode, MigrateOptions, MigrateResult, ResidualReference } from './migrate';
export { addCompatAlias, rewritePackageJson, rewriteSource, rewriteWorkspaceYaml } from './rewrite';

type Mode = 'full' | 'files-only' | 'dry';

const HELP = `openvue-migrate ${OPENVUE_VERSION}

Migrates a PrimeVue project to OpenVue in one run: rewrites package names in
package.json / pnpm-workspace.yaml and module specifiers in source files, adds
a package-manager override so third-party libraries that depend on primevue
resolve to OpenVue, and installs the migrated dependencies.

Run without any flags in a terminal for an interactive walkthrough that shows a
plan and lets you pick a mode. Pass a mode flag or --yes for a non-interactive
run (CI, scripts).

If OpenVue is already installed (found in package.json or node_modules), only
source files are rewritten — dependencies and node_modules are left untouched
and no install runs.

Usage:
  npx @openvue/migrate [dir] [options]

Options:
  --mode <mode>  full (rewrite + install), files-only (rewrite, no install),
                 or dry (report only). Implies --yes.
  --dry         Report what would change without writing any files
  --no-install  Rewrite files but do not run the package manager install
  --no-alias    Do not add the primevue -> openvue override to package.json
  --force       Do not stop on an uncommitted git working tree
  --yes, -y     Skip prompts and use defaults (full migration)
  --help        Show this help
  --version     Print the version
`;

const KNOWN_FLAGS = ['--dry', '--force', '--no-install', '--no-alias', '--yes', '-y'];
const MODES: Mode[] = ['full', 'files-only', 'dry'];

const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const bold = (text: string) => (useColor ? `\x1b[1m${text}\x1b[0m` : text);
const green = (text: string) => (useColor ? `\x1b[32m${text}\x1b[0m` : text);
const yellow = (text: string) => (useColor ? `\x1b[33m${text}\x1b[0m` : text);

function gitDirtyCount(dir: string): number | null {
    const inRepo = spawnSync('git', ['rev-parse', '--is-inside-work-tree'], { cwd: dir, encoding: 'utf8', shell: process.platform === 'win32' });

    if (inRepo.status !== 0 || inRepo.stdout.trim() !== 'true') return null;

    const status = spawnSync('git', ['status', '--porcelain'], { cwd: dir, encoding: 'utf8', shell: process.platform === 'win32' });

    if (status.status !== 0) return null;

    const output = status.stdout.trim();

    return output.length === 0 ? 0 : output.split('\n').length;
}

function totalReferences(result: MigrateResult): number {
    return result.changedFiles.reduce((sum, file) => sum + file.changes, 0);
}

/**
 * Prints the changed files, notes, warnings and residual references for a non-interactive run.
 * Kept byte-for-byte compatible with earlier releases so scripts and CI parsing stay stable.
 */
function printPlainResult(result: MigrateResult, dry: boolean): void {
    if (result.changedFiles.length === 0) {
        // A hard-failed run (e.g. an unsupported PrimeVue major) also has no changed files, but its
        // blocking warning is printed below — do not claim there was nothing to do.
        if (!result.failed) console.log('No PrimeVue references found — nothing to do.');
    } else {
        const total = totalReferences(result);

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

    printResiduals(result, (line) => console.log(line));
}

function printResiduals(result: MigrateResult, sink: (line: string) => void): void {
    if (result.residuals.length === 0) return;

    sink('\n' + yellow(bold(`${result.residuals.length} PrimeVue reference${result.residuals.length === 1 ? '' : 's'} could not be rewritten automatically — review them:`)));

    for (const residual of result.residuals.slice(0, 25)) {
        sink(yellow(`  ${residual.file}:${residual.line}`) + `  ${residual.text.slice(0, 120)}`);
    }

    if (result.residuals.length > 25) sink(yellow(`  ...and ${result.residuals.length - 25} more.`));

    sink("Some of these may be intentional (the Nuxt 'primevue' config key, docs, comments); anything that is an import or dependency needs a manual fix.");
}

function runInstall(result: MigrateResult, dir: string, log: (line: string) => void): number {
    log(bold(`\nRunning ${result.installCommand}...\n`));

    const installRun = spawnSync(result.installCommand, { cwd: dir, stdio: 'inherit', shell: true });

    if (installRun.status !== 0) {
        console.error(yellow(`\n${result.installCommand} failed — fix the install errors above and re-run it. The source migration itself is complete.`));

        return typeof installRun.status === 'number' ? installRun.status : 1;
    }

    return 0;
}

/**
 * Non-interactive run: identical behaviour to earlier releases. Used for CI, piped output, and
 * whenever a mode flag or --yes is passed.
 */
function runNonInteractive(dir: string, mode: Mode, alias: boolean, force: boolean): number {
    const dry = mode === 'dry';

    if (!dry && !force && (gitDirtyCount(dir) ?? 0) > 0) {
        console.error(yellow('Your git working tree has uncommitted changes. Commit or stash them first so the migration is easy to review and revert, or re-run with --force.'));

        return 1;
    }

    console.log(bold(`openvue-migrate ${OPENVUE_VERSION}`) + (dry ? yellow(' (dry run — no files will be written)') : ''));
    console.log(`Migrating ${dir}\n`);

    const result = migrate({ dir, dry, alias });

    printPlainResult(result, dry);

    if (result.failed) {
        console.error(yellow(bold('\nMigration stopped before installation. Fix the blocking warning above and re-run.')));

        return 1;
    }

    if (result.changedFiles.length > 0 && !dry) {
        if (result.mode === 'sources-only') {
            console.log(bold('\nOpenVue is already installed — dependencies and node_modules were left untouched; only source files were rewritten.'));
        } else if (mode === 'full') {
            const code = runInstall(result, dir, (line) => console.log(line));

            if (code !== 0) return code;
            console.log(bold('\nDone. Review the diff and run your build.'));
        } else {
            console.log(bold('\nNext step:'));
            console.log(`  Run: ${result.installCommand}`);
        }
    }

    return 0;
}

/**
 * Interactive run: shows a plan, lets the user pick a mode, and confirms before touching a dirty
 * working tree. Only reached when stdin/stdout are a TTY and no mode flag or --yes was passed.
 */
async function runInteractive(dir: string, alias: boolean, force: boolean): Promise<number> {
    prompts.intro(pc.inverse(pc.cyan(` openvue-migrate ${OPENVUE_VERSION} `)));

    const scan = prompts.spinner();

    scan.start(`Scanning ${dir}`);
    const preview = migrate({ dir, dry: true, alias });
    const dirty = gitDirtyCount(dir);

    scan.stop(`Scanned ${dir}`);

    if (preview.failed) {
        prompts.log.error(preview.warnings[0] ?? 'The project is not on a supported PrimeVue version.');
        prompts.cancel('Migration stopped. No files were changed.');

        return 1;
    }

    if (preview.changedFiles.length === 0) {
        prompts.outro(pc.green('No PrimeVue references found — nothing to do.'));

        return 0;
    }

    const supported = preview.oldPrimevueRange !== null;

    prompts.note(
        [
            `${pc.dim('Package manager')}   ${preview.packageManager}`,
            `${pc.dim('PrimeVue')}          ${preview.oldPrimevueRange ?? pc.yellow('not detected')}`,
            `${pc.dim('Files to change')}   ${preview.changedFiles.length}`,
            `${pc.dim('References')}        ${totalReferences(preview)}`,
            `${pc.dim('Git working tree')}  ${dirty === null ? 'not a git repo' : dirty === 0 ? pc.green('clean') : pc.yellow(`${dirty} uncommitted change${dirty === 1 ? '' : 's'}`)}`
        ].join('\n'),
        'Migration plan'
    );

    for (const warning of preview.warnings) prompts.log.warn(warning);
    if (!supported) prompts.log.warn('Continue only if this project already builds against PrimeVue 4.x.');

    const mode = await prompts.select({
        message: 'How should I migrate?',
        initialValue: 'full' as Mode,
        options: [
            { value: 'full' as Mode, label: 'Full migration', hint: `rewrite files, add compat alias, run ${preview.installCommand}` },
            { value: 'files-only' as Mode, label: 'Files only', hint: 'rewrite files; you run the install yourself' },
            { value: 'dry' as Mode, label: 'Dry run', hint: 'show the changes, write nothing' }
        ]
    });

    if (prompts.isCancel(mode)) {
        prompts.cancel('Migration cancelled.');

        return 0;
    }

    if (mode !== 'dry' && dirty !== null && dirty > 0 && !force) {
        const proceed = await prompts.confirm({
            message: `Your git working tree has ${dirty} uncommitted change${dirty === 1 ? '' : 's'}. Continue anyway?`,
            initialValue: false
        });

        if (prompts.isCancel(proceed) || !proceed) {
            prompts.cancel('Migration cancelled. Commit or stash your changes, then re-run.');

            return 0;
        }
    }

    if (mode === 'dry') {
        const lines: string[] = [];

        for (const file of preview.changedFiles) {
            lines.push(`${pc.green(file.file)} ${pc.dim(`(${file.changes})`)}`);
            for (const rename of file.renamed ?? []) lines.push(`  ${pc.dim(rename)}`);
        }

        prompts.note(lines.join('\n'), `Would rewrite ${totalReferences(preview)} reference${totalReferences(preview) === 1 ? '' : 's'} in ${preview.changedFiles.length} file${preview.changedFiles.length === 1 ? '' : 's'}`);
        for (const note of preview.notes) prompts.log.info(note);
        printResiduals(preview, (line) => prompts.log.warn(line));
        prompts.outro(pc.yellow('Dry run complete — no files were written.'));

        return 0;
    }

    const apply = prompts.spinner();

    apply.start('Rewriting PrimeVue references');
    const result = migrate({ dir, dry: false, alias });
    const total = totalReferences(result);

    apply.stop(`Rewrote ${total} reference${total === 1 ? '' : 's'} in ${result.changedFiles.length} file${result.changedFiles.length === 1 ? '' : 's'}`);

    for (const file of result.changedFiles) {
        prompts.log.message(`${pc.green(file.file)} ${pc.dim(`(${file.changes})`)}`);
        for (const rename of file.renamed ?? []) prompts.log.message(`  ${pc.dim(rename)}`, { symbol: pc.dim('│') });
    }

    for (const note of result.notes) prompts.log.info(note);
    for (const warning of result.warnings) prompts.log.warn(warning);
    printResiduals(result, (line) => prompts.log.warn(line));

    if (result.mode === 'sources-only') {
        prompts.outro(pc.green('OpenVue was already installed — only source files were rewritten. Review the diff and run your build.'));

        return 0;
    }

    if (mode === 'full') {
        prompts.log.step(`Running ${result.installCommand}`);
        const installRun = spawnSync(result.installCommand, { cwd: dir, stdio: 'inherit', shell: true });

        if (installRun.status !== 0) {
            prompts.log.error(`${result.installCommand} failed — fix the install errors above and re-run it. The source migration itself is complete.`);
            prompts.outro(pc.yellow('Migration rewrote your files but the install did not finish.'));

            return typeof installRun.status === 'number' ? installRun.status : 1;
        }

        prompts.outro(pc.green('Done. Review the diff and run your build.'));

        return 0;
    }

    prompts.note(`Run ${pc.cyan(result.installCommand)} to install the migrated dependencies.`, 'Next step');
    prompts.outro(pc.green('Files rewritten. Review the diff, then install.'));

    return 0;
}

async function run(): Promise<number> {
    const argv = process.argv.slice(2);

    if (argv.includes('--help') || argv.includes('-h')) {
        console.log(HELP);

        return 0;
    }

    if (argv.includes('--version') || argv.includes('-v')) {
        console.log(OPENVUE_VERSION);

        return 0;
    }

    // Pull --mode <value> / --mode=<value> out first so the value is never mistaken for the directory.
    let modeArg: Mode | undefined;
    const consumed = new Set<number>();

    for (let i = 0; i < argv.length; i++) {
        let value: string | undefined;

        if (argv[i] === '--mode') {
            value = argv[i + 1];
            consumed.add(i);
            consumed.add(i + 1);
        } else if (argv[i].startsWith('--mode=')) {
            value = argv[i].slice('--mode='.length);
            consumed.add(i);
        } else {
            continue;
        }

        if (value === undefined || !MODES.includes(value as Mode)) {
            console.error(`--mode must be one of: ${MODES.join(', ')}\n\n${HELP}`);

            return 1;
        }

        modeArg = value as Mode;
    }

    const args = argv.filter((_, index) => !consumed.has(index));
    const dryFlag = args.includes('--dry');
    const force = args.includes('--force');
    const installFlag = !args.includes('--no-install');
    const alias = !args.includes('--no-alias');
    const yes = args.includes('--yes') || args.includes('-y');
    const unknownFlags = args.filter((arg) => arg.startsWith('-') && !KNOWN_FLAGS.includes(arg));

    if (unknownFlags.length > 0) {
        console.error(`Unknown option: ${unknownFlags[0]}\n\n${HELP}`);

        return 1;
    }

    // A run has at most one mode. Collect every source that implies one and reject contradictions.
    const impliedModes = [...new Set<Mode>([...(dryFlag ? ['dry' as Mode] : []), ...(!installFlag ? ['files-only' as Mode] : []), ...(modeArg ? [modeArg] : [])])];

    if (impliedModes.length > 1) {
        console.error(`Conflicting mode flags: ${impliedModes.join(', ')}. Pick one.\n\n${HELP}`);

        return 1;
    }

    const preselected = impliedModes[0];
    const positional = args.filter((arg) => !arg.startsWith('-'));
    const dir = resolve(positional[0] ?? '.');

    if (!existsSync(dir) || !statSync(dir).isDirectory()) {
        console.error(`Not a directory: ${dir}`);

        return 1;
    }

    // Prompt only when attached to a terminal and the user has not already committed to a mode
    // (via --dry/--no-install/--mode) or asked to skip prompts (--yes). This keeps scripts and CI,
    // which pass a mode flag or run without a TTY, fully non-interactive.
    const canPrompt = Boolean(process.stdin.isTTY && process.stdout.isTTY);

    if (canPrompt && !yes && preselected === undefined) return runInteractive(dir, alias, force);

    return runNonInteractive(dir, preselected ?? 'full', alias, force);
}

function isMainModule(): boolean {
    if (!process.argv[1]) return false;

    try {
        return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(resolve(process.argv[1]));
    } catch {
        return false;
    }
}

if (isMainModule()) run().then((code) => process.exit(code));
