import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { OPENVUE_VERSION } from '../src/mappings';
import { migrate } from '../src/migrate';
import { walk } from '../src/walk';

const FIXTURES = fileURLToPath(new URL('./fixtures', import.meta.url));
const tempDirs: string[] = [];

function tempDir(): string {
    const dir = mkdtempSync(join(tmpdir(), 'openvue-migrate-'));

    tempDirs.push(dir);

    return dir;
}

function copyFixture(name: string): string {
    const dir = tempDir();

    cpSync(join(FIXTURES, name, 'before'), dir, { recursive: true });

    return dir;
}

// git checkout may normalize fixture line endings differently per platform,
// so compare with LF-normalized content
const normalizeEol = (text: string) => text.replaceAll('\r\n', '\n');

function assertMatchesExpected(migratedDir: string, name: string) {
    const expectedDir = join(FIXTURES, name, 'after');

    for (const expectedFile of walk(expectedDir)) {
        const relativePath = relative(expectedDir, expectedFile);
        const expected = normalizeEol(readFileSync(expectedFile, 'utf8')).replaceAll('__OPENVUE_VERSION__', OPENVUE_VERSION);
        const actual = normalizeEol(readFileSync(join(migratedDir, relativePath), 'utf8'));

        expect(actual, relativePath).toBe(expected);
    }
}

afterEach(() => {
    while (tempDirs.length > 0) rmSync(tempDirs.pop()!, { recursive: true, force: true });
});

describe('migrate', () => {
    it('migrates the basic fixture project to the expected output', () => {
        const dir = copyFixture('basic');
        const result = migrate({ dir });

        assertMatchesExpected(dir, 'basic');
        expect(result.mode).toBe('full');
        expect(result.changedFiles.map((file) => file.file).sort()).toEqual(['components.d.ts', 'nuxt.config.ts', 'package.json', 'src/App.vue', 'src/main.js', 'vite.config.mjs']);
        expect(result.oldPrimevueRange).toBe('^4.3.3');
        expect(result.packageManager).toBe('npm');
        expect(result.warnings).toEqual([]);
        expect(result.residuals).toEqual([]);
        expect(result.notes.some((note) => note.includes('npm:openvue'))).toBe(true);
    });

    it('writes nothing in dry mode but reports the same changes', () => {
        const dir = copyFixture('basic');
        const before = Object.fromEntries(walk(dir).map((file) => [file, readFileSync(file, 'utf8')]));
        const result = migrate({ dir, dry: true });

        expect(result.changedFiles.length).toBe(6);

        for (const [file, content] of Object.entries(before)) {
            expect(readFileSync(file, 'utf8'), file).toBe(content);
        }
    });

    it('switches to sources-only mode when openvue is already a dependency', () => {
        const dir = copyFixture('basic');
        const packageJson = join(dir, 'package.json');
        const pkg = JSON.parse(readFileSync(packageJson, 'utf8'));

        delete pkg.dependencies.primevue;
        pkg.dependencies.openvue = '0.0.1-alpha.9';
        writeFileSync(packageJson, JSON.stringify(pkg, null, 4));

        const before = readFileSync(packageJson, 'utf8');
        const result = migrate({ dir });

        expect(result.mode).toBe('sources-only');
        expect(readFileSync(packageJson, 'utf8')).toBe(before);
        expect(readFileSync(join(dir, 'src', 'main.js'), 'utf8')).toContain(`from 'openvue/config'`);
        expect(readFileSync(join(dir, 'components.d.ts'), 'utf8')).toContain(`import('openvue/button')`);
    });

    it('switches to sources-only mode when openvue is present in node_modules', () => {
        const dir = copyFixture('basic');

        mkdirSync(join(dir, 'node_modules', 'openvue'), { recursive: true });

        const packageJson = join(dir, 'package.json');
        const before = readFileSync(packageJson, 'utf8');
        const result = migrate({ dir });

        expect(result.mode).toBe('sources-only');
        expect(readFileSync(packageJson, 'utf8')).toBe(before);
        expect(readFileSync(join(dir, 'src', 'App.vue'), 'utf8')).toContain(`from 'openvue/button'`);
    });

    it('skips the alias when disabled', () => {
        const dir = copyFixture('basic');
        const result = migrate({ dir, alias: false });
        const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));

        expect(pkg.overrides).toBeUndefined();
        expect(result.notes.some((note) => note.includes('npm:openvue'))).toBe(false);
    });

    it('reports residual references the rewrite could not handle', () => {
        const dir = copyFixture('basic');

        mkdirSync(join(dir, 'styles'));
        writeFileSync(join(dir, 'styles', 'legacy.scss'), `@import 'primevue/resources/themes/aura/theme.css';\n`);
        writeFileSync(join(dir, 'src', 'lazy.js'), 'export const load = (name) => import(`primevue/${name}`);\n');

        const result = migrate({ dir });
        const files = result.residuals.map((residual) => residual.file);

        expect(files).toContain('styles/legacy.scss');
        expect(files).toContain('src/lazy.js');
        expect(readFileSync(join(dir, 'src', 'lazy.js'), 'utf8')).toContain('primevue/${name}');
    });

    it('handles a package.json saved with a UTF-8 BOM', () => {
        const dir = copyFixture('basic');
        const packageJson = join(dir, 'package.json');
        // the prepended string below contains the invisible U+FEFF byte-order mark

        writeFileSync(packageJson, '﻿' + readFileSync(packageJson, 'utf8'));

        const result = migrate({ dir });
        const pkg = JSON.parse(readFileSync(packageJson, 'utf8'));

        expect(result.failed).toBe(false);
        expect(pkg.dependencies.openvue).toBe(OPENVUE_VERSION);
        expect(pkg.dependencies.primevue).toBeUndefined();
    });

    it('flags the migration as failed when the root package.json is unparsable', () => {
        const dir = copyFixture('basic');

        writeFileSync(join(dir, 'package.json'), '{ this is not json');

        const result = migrate({ dir });

        expect(result.failed).toBe(true);
        expect(result.warnings.some((warning) => warning.includes('could not be parsed'))).toBe(true);
    });

    it('warns when the project used a pre-fork PrimeVue major', () => {
        const dir = copyFixture('basic');
        const packageJson = join(dir, 'package.json');
        const pkg = JSON.parse(readFileSync(packageJson, 'utf8'));

        pkg.dependencies.primevue = '^3.53.0';
        writeFileSync(packageJson, JSON.stringify(pkg, null, 4));

        const result = migrate({ dir });

        expect(result.warnings.some((warning) => warning.includes('predates the OpenVue fork point'))).toBe(true);
    });
});
