import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface AddOptions {
    /** Directory holding the OpenVolt component files to copy from. */
    sourceDir: string;
    /** Directory the files are copied into, e.g. `<project>/src/volt`. */
    targetDir: string;
    /** Also copy the OpenVolt components the requested ones import. Defaults to true. */
    deps?: boolean;
    /** Replace files that already exist in the target directory. Defaults to false. */
    overwrite?: boolean;
}

export interface AddResult {
    /** Files written, in copy order. */
    added: string[];
    /** Files left alone because they already existed and `overwrite` was off. */
    skipped: string[];
    /** Requested names that match no component. */
    unknown: string[];
    /** Components written only because a requested component imports them. */
    dependencies: string[];
    /** npm packages the copied files import. */
    packages: string[];
}

const SIBLING_IMPORT = /from\s+['"]\.\/([\w-]+)(?:\.vue)?['"]/g;
const PACKAGE_IMPORT = /from\s+['"]((?:@[\w.-]+\/)?\w[\w.-]*)[^'"]*['"]/g;

export function listComponents(sourceDir: string): string[] {
    return readdirSync(sourceDir)
        .filter((file) => file.endsWith('.vue'))
        .map((file) => file.slice(0, -'.vue'.length))
        .sort();
}

/** Copies the requested components (or `all`) plus `utils.ts` and, by default, the sibling components they import. */
export function add(names: string[], options: AddOptions): AddResult {
    const { sourceDir, targetDir, deps = true, overwrite = false } = options;
    const available = listComponents(sourceDir);
    const byLowerName = new Map(available.map((name) => [name.toLowerCase(), name]));
    const result: AddResult = { added: [], skipped: [], unknown: [], dependencies: [], packages: [] };
    const requested = new Set<string>();

    for (const name of names) {
        if (name.toLowerCase() === 'all') {
            available.forEach((component) => requested.add(component));
            continue;
        }

        const component = byLowerName.get(name.toLowerCase().replace(/\.vue$/, ''));

        if (component) requested.add(component);
        else result.unknown.push(name);
    }

    if (requested.size === 0) return result;

    const queue = [...requested];
    const files = new Set(['utils.ts']);
    const packages = new Set<string>();

    while (queue.length > 0) {
        const component = queue.shift()!;
        const file = `${component}.vue`;

        if (files.has(file)) continue;
        files.add(file);
        if (!requested.has(component)) result.dependencies.push(component);

        const source = readFileSync(join(sourceDir, file), 'utf8');

        for (const [, sibling] of source.matchAll(SIBLING_IMPORT)) {
            if (deps && byLowerName.has(sibling.toLowerCase())) queue.push(byLowerName.get(sibling.toLowerCase())!);
        }
    }

    mkdirSync(targetDir, { recursive: true });

    for (const file of files) {
        for (const [, name] of readFileSync(join(sourceDir, file), 'utf8').matchAll(PACKAGE_IMPORT)) packages.add(name);

        const target = join(targetDir, file);

        if (existsSync(target) && !overwrite) {
            result.skipped.push(file);
            continue;
        }

        copyFileSync(join(sourceDir, file), target);
        result.added.push(file);
    }

    result.dependencies = result.dependencies.filter((name) => result.added.includes(`${name}.vue`));
    result.packages = [...packages].filter((name) => name !== 'vue').sort();

    return result;
}

/** Packages from `packages` that the project's package.json does not list. Returns all of them when there is no package.json. */
export function missingPackages(projectDir: string, packages: string[]): string[] {
    const file = join(projectDir, 'package.json');

    if (!existsSync(file)) return packages;

    const pkg = JSON.parse(readFileSync(file, 'utf8'));
    const declared = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };

    return packages.filter((name) => !(name in declared));
}
