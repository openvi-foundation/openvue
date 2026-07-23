import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, relative } from 'node:path';
import { addCompatAlias, PackageManager, rewritePackageJson, rewriteSource, rewriteWorkspaceYaml } from './rewrite';
import { walk } from './walk';

const SOURCE_EXTENSIONS = new Set(['.js', '.mjs', '.cjs', '.ts', '.mts', '.cts', '.jsx', '.tsx', '.vue', '.astro', '.mdx']);
const AUDIT_EXTRA_EXTENSIONS = new Set(['.css', '.scss', '.sass', '.less', '.styl', '.html', '.json', '.yaml', '.yml']);

// A bare 'primevue' string is a package reference anywhere in these files, not only after import/require.
const CONFIG_FILE = /(^|\.)config\.[cm]?[jt]s$/i;

// Package-reference shapes that should not survive a migration: a string literal starting with
// `primevue` or `primevue/`, any `@primevue/` occurrence, or a CDN url segment like `/primevue@4`.
const RESIDUAL_REFERENCE = /['"`]primevue(?=[/'"`])|@primevue\/|\/primevue@/;
const DEPENDENCY_SECTIONS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];

export type MigrateMode = 'full' | 'sources-only';

// Windows editors often save package.json with a UTF-8 BOM, which JSON.parse rejects.
function readText(file: string): string {
    const text = readFileSync(file, 'utf8');

    return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

export interface MigrateOptions {
    dir: string;
    dry?: boolean;
    alias?: boolean;
}

export interface ChangedFile {
    file: string;
    changes: number;
    renamed?: string[];
}

export interface ResidualReference {
    file: string;
    line: number;
    text: string;
}

export interface MigrateResult {
    mode: MigrateMode;
    changedFiles: ChangedFile[];
    warnings: string[];
    notes: string[];
    residuals: ResidualReference[];
    // The migration is incomplete in a way the user must fix before installing (e.g. the root
    // package.json could not be rewritten) — the CLI must not install and must exit non-zero.
    failed: boolean;
    oldPrimevueRange: string | null;
    packageManager: PackageManager;
    installCommand: string;
}

// Tooling packages users install in order to run the migration or the MCP server; their presence
// says nothing about whether the project's runtime dependencies were switched to OpenVue.
const TOOLING_PACKAGES = new Set(['@openvue/migrate', '@openvue/mcp']);

/**
 * A project that already declares or installed OpenVue has handled the dependency switch itself —
 * the migration then only rewrites source files and must not touch package.json or node_modules.
 */
export function hasOpenVue(dir: string): boolean {
    if (existsSync(join(dir, 'node_modules', 'openvue'))) return true;

    const packageJson = join(dir, 'package.json');

    if (!existsSync(packageJson)) return false;

    try {
        const pkg = JSON.parse(readText(packageJson));

        for (const section of ['dependencies', 'devDependencies']) {
            const deps = pkg[section];

            if (deps && typeof deps === 'object' && Object.keys(deps).some((key) => (key === 'openvue' || key.startsWith('@openvue/')) && !TOOLING_PACKAGES.has(key))) return true;
        }
    } catch {
        // unparsable package.json — treat as not migrated
    }

    return false;
}

/**
 * Detects the package manager from lockfiles or the packageManager field, walking up parent
 * directories so running from a workspace package still reports the monorepo's real manager.
 */
export function detectPackageManager(dir: string): PackageManager {
    let current = dir;

    for (;;) {
        if (existsSync(join(current, 'pnpm-lock.yaml')) || existsSync(join(current, 'pnpm-workspace.yaml'))) return 'pnpm';
        if (existsSync(join(current, 'yarn.lock'))) return 'yarn';
        if (existsSync(join(current, 'bun.lock')) || existsSync(join(current, 'bun.lockb'))) return 'bun';
        if (existsSync(join(current, 'package-lock.json'))) return 'npm';

        const packageJson = join(current, 'package.json');

        if (existsSync(packageJson)) {
            try {
                const field = JSON.parse(readText(packageJson)).packageManager;
                const name = typeof field === 'string' ? field.split('@')[0] : '';

                if (name === 'pnpm' || name === 'yarn' || name === 'bun' || name === 'npm') return name;
            } catch {
                // unparsable package.json — keep walking up
            }
        }

        const parent = dirname(current);

        if (parent === current) return 'npm';
        current = parent;
    }
}

const INSTALL_COMMANDS: Record<PackageManager, string> = {
    npm: 'npm install',
    pnpm: 'pnpm install',
    yarn: 'yarn install',
    bun: 'bun install'
};

interface PrimeVueVersion {
    range: string;
    major: number | null;
    source: string;
}

function parsePrimeVueMajor(range: string): number | null {
    const value = range.trim();
    const direct = /^(?:npm:primevue@)?[~^=v\s]*(\d+)(?:\.|x|\*|$)/i.exec(value);

    if (direct) return parseInt(direct[1], 10);

    const bounded = /^>=?\s*(\d+)(?:\.\d+){0,2}\s+<\s*(\d+)(?:\.\d+){0,2}$/.exec(value);

    if (bounded && parseInt(bounded[2], 10) === parseInt(bounded[1], 10) + 1) return parseInt(bounded[1], 10);

    return null;
}

function readPackagePrimeVueRange(file: string): string | null {
    try {
        const pkg = JSON.parse(readText(file));

        for (const section of DEPENDENCY_SECTIONS) {
            const range = pkg[section]?.primevue;

            if (typeof range === 'string') return range;
        }
    } catch {
        // The main rewrite pass reports malformed package.json files with their paths.
    }

    return null;
}

function readCatalogRange(dir: string): string | null {
    let current = dir;

    for (;;) {
        const workspace = join(current, 'pnpm-workspace.yaml');

        if (existsSync(workspace)) {
            const match = /^\s*['"]?primevue['"]?\s*:\s*['"]?([^\s'"#]+)['"]?/m.exec(readText(workspace));

            if (match) return match[1];
        }

        const parent = dirname(current);

        if (parent === current) return null;
        current = parent;
    }
}

function readInstalledVersion(dir: string): string | null {
    let current = dir;

    for (;;) {
        const installed = join(current, 'node_modules', 'primevue', 'package.json');

        if (existsSync(installed)) {
            try {
                const version = JSON.parse(readText(installed)).version;

                if (typeof version === 'string') return version;
            } catch {
                return null;
            }
        }

        const parent = dirname(current);

        if (parent === current) return null;
        current = parent;
    }
}

function readLockfileVersion(dir: string): string | null {
    let current = dir;

    for (;;) {
        const packageLock = join(current, 'package-lock.json');

        if (existsSync(packageLock)) {
            try {
                const lock = JSON.parse(readText(packageLock));
                const version = lock.packages?.['node_modules/primevue']?.version ?? lock.dependencies?.primevue?.version;

                if (typeof version === 'string') return version;
            } catch {
                // Try another lockfile or continue walking toward the workspace root.
            }
        }

        for (const lockName of ['pnpm-lock.yaml', 'yarn.lock', 'bun.lock', 'bun.lockb']) {
            const lockfile = join(current, lockName);

            if (!existsSync(lockfile)) continue;

            const text = readText(lockfile);
            const patterns =
                lockName === 'pnpm-lock.yaml'
                    ? [/^\s{2,}primevue@((?:\d+\.){2}\d+[^:\s(]*)(?:\([^\n]*)?:/m, /^\s{6,}version:\s*['"]?((?:\d+\.){2}\d+[^\s'"(]*)/m]
                    : lockName === 'yarn.lock'
                      ? [/^primevue@[^:]+:\s*\r?\n\s+version\s+['"]((?:\d+\.){2}\d+[^'"]*)/m]
                      : [/primevue@((?:\d+\.){2}\d+[^\s'",\]]*)/m];

            for (const pattern of patterns) {
                const match = pattern.exec(text);

                if (match) return match[1];
            }
        }

        const parent = dirname(current);

        if (parent === current) return null;
        current = parent;
    }
}

function detectPrimeVueVersions(dir: string, files: string[]): PrimeVueVersion[] {
    const packageFiles = files
        .filter((file) => basename(file) === 'package.json')
        .sort((a, b) => {
            if (a === join(dir, 'package.json')) return -1;
            if (b === join(dir, 'package.json')) return 1;

            return a.localeCompare(b);
        });
    const detected: PrimeVueVersion[] = [];
    const unresolved: PrimeVueVersion[] = [];

    for (const file of packageFiles) {
        const declared = readPackagePrimeVueRange(file);

        if (declared === null) continue;

        const directMajor = parsePrimeVueMajor(declared);
        const source = relative(dir, file).replace(/\\/g, '/');

        if (directMajor !== null) {
            detected.push({ range: declared, major: directMajor, source });
            continue;
        }

        if (declared.startsWith('catalog:')) {
            const catalog = readCatalogRange(dirname(file));

            if (catalog !== null) {
                detected.push({ range: catalog, major: parsePrimeVueMajor(catalog), source: `${source} via pnpm-workspace.yaml catalog` });
                continue;
            }
        }

        unresolved.push({ range: declared, major: null, source });
    }

    const installed = readInstalledVersion(dir);
    const locked = installed === null ? readLockfileVersion(dir) : null;
    const inferred = installed ?? locked;
    const inferredSource = installed !== null ? 'node_modules/primevue/package.json' : 'lockfile';

    if (unresolved.length > 0 && inferred !== null) {
        for (const item of unresolved) {
            detected.push({ range: inferred, major: parsePrimeVueMajor(inferred), source: `${item.source} (${item.range}) via ${inferredSource}` });
        }
    } else {
        detected.push(...unresolved);
    }

    if (detected.length === 0 && inferred !== null) detected.push({ range: inferred, major: parsePrimeVueMajor(inferred), source: inferredSource });

    return detected;
}

// Lockfiles are regenerated by the install step, so their stale references are not actionable.
const LOCKFILES = new Set(['package-lock.json', 'npm-shrinkwrap.json', 'pnpm-lock.yaml', 'yarn.lock', 'bun.lock']);

function isAuditFile(file: string): boolean {
    const name = basename(file);

    if (LOCKFILES.has(name)) return false;

    return SOURCE_EXTENSIONS.has(extname(file)) || AUDIT_EXTRA_EXTENSIONS.has(extname(file)) || name === 'package.json' || /^(tsconfig|jsconfig)[^/\\]*\.json$/.test(name);
}

/**
 * Scans for PrimeVue references that survived the rewrite (interpolated template literals, CSS
 * imports, tsconfig paths, CDN urls, intentionally kept keys) so the CLI never reports success
 * while actionable references remain.
 */
export function auditResiduals(dir: string, files: string[]): ResidualReference[] {
    const residuals: ResidualReference[] = [];

    for (const file of files) {
        if (!isAuditFile(file)) continue;

        const lines = readText(file).split('\n');

        for (let i = 0; i < lines.length; i++) {
            // The compat alias this tool writes is the one intended remaining reference.
            if (RESIDUAL_REFERENCE.test(lines[i]) && !lines[i].includes('npm:openvue')) {
                residuals.push({ file: relative(dir, file).replace(/\\/g, '/'), line: i + 1, text: lines[i].trim() });
            }
        }
    }

    return residuals;
}

/**
 * Runs the PrimeVue -> OpenVue migration over a project directory.
 * Pure file transformation — git preflight, install and console output live in the CLI.
 */
export function migrate(options: MigrateOptions): MigrateResult {
    const { dir, dry = false, alias = true } = options;
    const mode: MigrateMode = hasOpenVue(dir) ? 'sources-only' : 'full';
    const changedFiles: ChangedFile[] = [];
    const warnings: string[] = [];
    const notes: string[] = [];
    const skippedKeyFiles = new Set<string>();
    const unknownScoped = new Set<string>();
    const files = walk(dir);
    const packageManager = detectPackageManager(dir);
    const installCommand = INSTALL_COMMANDS[packageManager];
    const detectedPrimeVue = mode === 'full' ? detectPrimeVueVersions(dir, files) : [];
    const unsupportedPrimeVue = detectedPrimeVue.find((item) => item.major !== null && item.major !== 4);
    const primaryPrimeVue = unsupportedPrimeVue ?? detectedPrimeVue.find((item) => item.major === 4) ?? detectedPrimeVue[0] ?? null;
    const unknownPrimeVue = detectedPrimeVue.find((item) => item.major === null);
    let oldPrimevueRange: string | null = null;
    let rootPackageJsonFailed = false;

    if (unsupportedPrimeVue !== undefined) {
        const position = unsupportedPrimeVue.major! < 4 ? 'predates' : 'postdates';

        warnings.push(
            `Detected primevue@${unsupportedPrimeVue.range} from ${unsupportedPrimeVue.source}. PrimeVue ${unsupportedPrimeVue.major}.x ${position} the supported OpenVue fork line (PrimeVue 4.x). Upgrade or downgrade the project to PrimeVue 4.5.5, verify it, and run the migration again. No files were changed.`
        );

        return {
            mode,
            changedFiles,
            warnings,
            notes,
            residuals: [],
            failed: true,
            oldPrimevueRange: unsupportedPrimeVue.range,
            packageManager,
            installCommand
        };
    }

    if (primaryPrimeVue !== null) oldPrimevueRange = primaryPrimeVue.range;

    if (unknownPrimeVue !== undefined) {
        warnings.push(`Could not determine the PrimeVue major version from ${unknownPrimeVue.source} (${unknownPrimeVue.range}). Continuing with the rename; verify that the project was already working on PrimeVue 4.x.`);
    } else if (mode === 'full') {
        if (detectedPrimeVue.length === 0) warnings.push('Could not determine the installed PrimeVue major version. Continuing with the rename; verify that the project was already working on PrimeVue 4.x.');
    }

    for (const file of files) {
        const name = basename(file);
        const displayPath = relative(dir, file).replace(/\\/g, '/');

        if (mode === 'sources-only' && (name === 'package.json' || name === 'pnpm-workspace.yaml')) continue;

        if (name === 'package.json') {
            const text = readText(file);
            let result;

            try {
                result = rewritePackageJson(text);
            } catch {
                warnings.push(`${displayPath}: could not be parsed as JSON, skipped.`);
                if (displayPath === 'package.json') rootPackageJsonFailed = true;
                continue;
            }

            if (result.oldPrimevueRange !== null && oldPrimevueRange === null) oldPrimevueRange = result.oldPrimevueRange;

            result.unknownScoped.forEach((pkg) => unknownScoped.add(pkg));
            result.notes.forEach((note) => notes.push(`${displayPath}: ${note}`));

            if (result.changed) {
                if (!dry) writeFileSync(file, result.text);
                changedFiles.push({ file: displayPath, changes: result.renamed.length + result.notes.length, renamed: result.renamed });
            }
        } else if (name === 'pnpm-workspace.yaml') {
            const text = readFileSync(file, 'utf8');
            const result = rewriteWorkspaceYaml(text);

            if (result.count > 0) {
                if (!dry) writeFileSync(file, result.text);
                changedFiles.push({ file: displayPath, changes: result.count });
            }
        } else if (SOURCE_EXTENSIONS.has(extname(file))) {
            const text = readFileSync(file, 'utf8');
            const result = rewriteSource(text, { configFile: CONFIG_FILE.test(name) });

            if (result.skippedKeys.length > 0) skippedKeyFiles.add(displayPath);
            result.unknownScoped.forEach((pkg) => unknownScoped.add(pkg));

            if (result.count > 0) {
                if (!dry) writeFileSync(file, result.code);
                changedFiles.push({ file: displayPath, changes: result.count });
            }
        }
    }

    const rootPackageJson = join(dir, 'package.json');

    if (mode === 'full' && alias && changedFiles.length > 0 && !rootPackageJsonFailed && existsSync(rootPackageJson)) {
        try {
            const result = addCompatAlias(readText(rootPackageJson), packageManager);

            if (result.added) {
                if (!dry) writeFileSync(rootPackageJson, result.text);
                notes.push(`package.json: ${dry ? 'would add' : 'added'} override "primevue" -> "npm:openvue" so third-party libraries that (peer-)depend on primevue resolve to OpenVue. Remove it once your dependencies are OpenVue-native.`);
            }
        } catch {
            warnings.push('package.json: could not add the primevue -> openvue compatibility override; add it manually if any of your dependencies require primevue.');
        }
    }

    for (const file of skippedKeyFiles) {
        warnings.push(`${file}: found a quoted 'primevue' object key and left it unchanged — the Nuxt module config key is still 'primevue' in OpenVue. Review it if it was meant as something else (e.g. a bundler alias).`);
    }

    for (const pkg of unknownScoped) {
        warnings.push(`${pkg} is not a package OpenVue publishes; it was left unchanged. Review it manually.`);
    }

    const residuals = dry ? [] : auditResiduals(dir, files);

    return { mode, changedFiles, warnings, notes, residuals, failed: rootPackageJsonFailed, oldPrimevueRange, packageManager, installCommand };
}
