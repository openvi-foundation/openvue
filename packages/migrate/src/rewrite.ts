import { isUnknownScopedPackage, OPENVUE_VERSION, renameSpecifier } from './mappings';

export interface SourceRewriteOptions {
    // In config files (nuxt.config.ts, vite.config.mjs, ...) a bare 'primevue' string is a package
    // reference even outside import syntax (transpile/include lists), so it is rewritten anywhere.
    configFile?: boolean;
}

export interface SourceRewriteResult {
    code: string;
    count: number;
    skippedKeys: string[];
    unknownScoped: string[];
}

// Matches single-quoted, double-quoted and backtick string literals on a single line.
const STRING_LITERAL = /(['"`])((?:\\.|(?!\1)[^\\\r\n])*)\1/g;

// Text immediately before a string literal that marks it as a module specifier:
// `from '...'`, `import '...'`, `import('...')`, `require('...')`.
const IMPORT_CONTEXT = /(?:\bfrom|\bimport)\s*$|(?:\bimport|\brequire)\s*\(\s*$/;

// Values using a package-manager protocol are kept as-is when their key is renamed; plain semver ranges are replaced.
const VALUE_PROTOCOL = /^(workspace:|catalog:|npm:|file:|link:|portal:|git|https?:)/;

/**
 * Rewrites PrimeVue module specifiers inside string literals of a source file (.js/.ts/.vue/...).
 * Subpath (`primevue/x`) and scoped (`@primevue/x`) specifiers are unambiguous and rewritten in any
 * position — this also covers require(), dynamic import(), Nuxt `modules` arrays and Vite config
 * entries. A bare `primevue` literal is only rewritten in import context (or anywhere in config
 * files), so runtime data like `provider: 'primevue'` is never touched in application code.
 */
export function rewriteSource(code: string, options: SourceRewriteOptions = {}): SourceRewriteResult {
    let out = '';
    let last = 0;
    let count = 0;
    const skippedKeys: string[] = [];
    const unknownScoped: string[] = [];
    let match: RegExpExecArray | null;

    STRING_LITERAL.lastIndex = 0;

    while ((match = STRING_LITERAL.exec(code)) !== null) {
        const [literal, quote, content] = match;

        if (quote === '`' && content.includes('${')) continue;

        const renamed = renameSpecifier(content);

        if (renamed === null) {
            if (isUnknownScopedPackage(content)) unknownScoped.push(content);
            continue;
        }

        if (content === 'primevue') {
            // A bare 'primevue' key is most likely the Nuxt configKey, which OpenVue intentionally
            // kept as 'primevue'. Skip it and report instead.
            if (/^\s*:/.test(code.slice(match.index + literal.length))) {
                skippedKeys.push(content);
                continue;
            }

            const preceding = code.slice(Math.max(0, match.index - 40), match.index);

            if (!options.configFile && !IMPORT_CONTEXT.test(preceding)) continue;
        }

        out += code.slice(last, match.index) + quote + renamed + quote;
        last = match.index + literal.length;
        count++;
    }

    return { code: out + code.slice(last), count, skippedKeys, unknownScoped };
}

export interface PackageJsonRewriteResult {
    text: string;
    changed: boolean;
    renamed: string[];
    notes: string[];
    unknownScoped: string[];
    oldPrimevueRange: string | null;
}

const DEPENDENCY_SECTIONS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies', 'peerDependenciesMeta', 'resolutions', 'overrides'];

type DependencyMap = { [key: string]: unknown };

/**
 * Maps a dependency/override/resolution key to its OpenVue equivalent. Besides plain package names
 * this handles selector forms: `primevue@^4` (version selectors drop the now-meaningless range) and
 * `**\/primevue` / `some-lib/primevue` (yarn resolution paths keep their prefix).
 */
function renameDependencyKey(key: string): string | null {
    const direct = renameSpecifier(key);

    if (direct !== null) return direct;

    const selector = /^(.+)@([^@]+)$/.exec(key);

    if (selector !== null && renameSpecifier(selector[1]) !== null) return renameSpecifier(selector[1]);

    const path = /^(.*\/)(primevue|@primevue\/.+)$/.exec(key);

    if (path !== null && renameSpecifier(path[2]) !== null) return path[1] + renameSpecifier(path[2]);

    return null;
}

function renameDependencies(deps: DependencyMap, result: { renamed: string[]; notes: string[]; unknownScoped: string[] }): { next: DependencyMap; changed: boolean } {
    const next: DependencyMap = {};
    let changed = false;

    for (const [key, value] of Object.entries(deps)) {
        const renamedKey = renameDependencyKey(key) ?? key;
        let nextValue = value;

        if (renamedKey !== key) {
            // Partially migrated projects may already declare the OpenVue entry; keep theirs and
            // drop the PrimeVue one instead of overwriting based on key order.
            if (Object.prototype.hasOwnProperty.call(deps, renamedKey)) {
                result.notes.push(`kept existing ${renamedKey} entry and removed ${key}`);
                changed = true;
                continue;
            }

            changed = true;
            result.renamed.push(`${key} -> ${renamedKey}`);
        } else if (isUnknownScopedPackage(key)) {
            result.unknownScoped.push(key);
        }

        if (value !== null && typeof value === 'object') {
            // npm `overrides` may nest: { "some-lib": { "primevue": "^4.0.0" } }
            const child = renameDependencies(value as DependencyMap, result);

            nextValue = child.next;
            changed = changed || child.changed;
        } else if (renamedKey !== key && typeof value === 'string' && !VALUE_PROTOCOL.test(value)) {
            nextValue = OPENVUE_VERSION;
        }

        next[renamedKey] = nextValue;
    }

    return { next, changed };
}

function serializePackageJson(pkg: unknown, originalText: string): string {
    const indent = /\n([ \t]+)"/.exec(originalText)?.[1] ?? '  ';
    const newline = originalText.endsWith('\n') ? '\n' : '';

    return JSON.stringify(pkg, null, indent) + newline;
}

/**
 * Rewrites PrimeVue dependency entries in a package.json, preserving key order,
 * indentation style and any workspace:/catalog:/npm: protocol values.
 */
export function rewritePackageJson(text: string): PackageJsonRewriteResult {
    const pkg = JSON.parse(text);
    const result = { renamed: [] as string[], notes: [] as string[], unknownScoped: [] as string[] };
    let changed = false;
    let oldPrimevueRange: string | null = null;

    for (const section of DEPENDENCY_SECTIONS) {
        const deps = pkg[section];

        if (deps === null || typeof deps !== 'object') continue;

        if (typeof deps['primevue'] === 'string' && oldPrimevueRange === null) oldPrimevueRange = deps['primevue'];

        const renamed = renameDependencies(deps, result);

        pkg[section] = renamed.next;
        changed = changed || renamed.changed;
    }

    if (pkg.pnpm && pkg.pnpm.overrides && typeof pkg.pnpm.overrides === 'object') {
        const renamed = renameDependencies(pkg.pnpm.overrides, result);

        pkg.pnpm.overrides = renamed.next;
        changed = changed || renamed.changed;
    }

    if (!changed) return { text, changed: false, ...result, oldPrimevueRange };

    return { text: serializePackageJson(pkg, text), changed: true, ...result, oldPrimevueRange };
}

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export interface AliasRewriteResult {
    text: string;
    added: boolean;
}

/**
 * Adds a package-manager override aliasing `primevue` to `openvue`, so third-party libraries that
 * depend on or peer-depend on `primevue` resolve to OpenVue after the migration. Without this,
 * rename-only migration breaks any project whose dependency graph references PrimeVue transitively.
 */
export function addCompatAlias(text: string, packageManager: PackageManager): AliasRewriteResult {
    const pkg = JSON.parse(text);
    const alias = `npm:openvue@${OPENVUE_VERSION}`;

    if (packageManager === 'yarn') {
        pkg.resolutions = pkg.resolutions ?? {};

        if (pkg.resolutions['primevue'] !== undefined) return { text, added: false };

        pkg.resolutions['primevue'] = alias;
    } else if (packageManager === 'pnpm') {
        pkg.pnpm = pkg.pnpm ?? {};
        pkg.pnpm.overrides = pkg.pnpm.overrides ?? {};

        if (pkg.pnpm.overrides['primevue'] !== undefined) return { text, added: false };

        pkg.pnpm.overrides['primevue'] = alias;
    } else {
        pkg.overrides = pkg.overrides ?? {};

        if (pkg.overrides['primevue'] !== undefined) return { text, added: false };

        pkg.overrides['primevue'] = alias;
    }

    return { text: serializePackageJson(pkg, text), added: true };
}

export interface YamlRewriteResult {
    text: string;
    count: number;
}

// A pnpm-workspace.yaml dependency line: indentation, optionally quoted package name, colon, value.
const YAML_DEPENDENCY_LINE = /^(\s*)(['"]?)(primevue|@primevue\/[a-z0-9-]+)\2(\s*:\s*)(\S.*?)(\s*)$/;

/**
 * Rewrites PrimeVue entries in pnpm-workspace.yaml (catalog/catalogs/overrides sections).
 */
export function rewriteWorkspaceYaml(text: string): YamlRewriteResult {
    let count = 0;

    const lines = text.split('\n').map((line) => {
        const match = YAML_DEPENDENCY_LINE.exec(line);

        if (match === null) return line;

        const [, indent, quote, name, separator, value, trailing] = match;
        const renamed = renameSpecifier(name);

        if (renamed === null) return line;

        const nextValue = VALUE_PROTOCOL.test(value) ? value : OPENVUE_VERSION;

        count++;

        return `${indent}${quote}${renamed}${quote}${separator}${nextValue}${trailing}`;
    });

    return { text: lines.join('\n'), count };
}
