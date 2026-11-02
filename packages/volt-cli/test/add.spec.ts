import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { add, listComponents, missingPackages } from '../src/add';

const sourceDir = fileURLToPath(new URL('../../../apps/volt/volt', import.meta.url));
let dir: string;

beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'openvolt-vue-'));
});

afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
});

describe('add', () => {
    it('copies the component and utils.ts, matching names case-insensitively', () => {
        const result = add(['button'], { sourceDir, targetDir: dir });

        expect(result.added).toEqual(['utils.ts', 'Button.vue']);
        expect(readdirSync(dir).sort()).toEqual(['Button.vue', 'utils.ts']);
        expect(readFileSync(join(dir, 'Button.vue'), 'utf8')).toBe(readFileSync(join(sourceDir, 'Button.vue'), 'utf8'));
    });

    it('follows sibling imports unless deps is off', () => {
        const withDeps = add(['ConfirmDialog'], { sourceDir, targetDir: join(dir, 'a') });
        const withoutDeps = add(['ConfirmDialog'], { sourceDir, targetDir: join(dir, 'b'), deps: false });

        expect(withDeps.dependencies.length).toBeGreaterThan(0);
        expect(withDeps.added).toEqual(expect.arrayContaining(withDeps.dependencies.map((name) => `${name}.vue`)));
        expect(withoutDeps.dependencies).toEqual([]);
        expect(withoutDeps.added).toEqual(['utils.ts', 'ConfirmDialog.vue']);
    });

    it('adds every component for "all"', () => {
        const result = add(['all'], { sourceDir, targetDir: dir });

        expect(result.added).toHaveLength(listComponents(sourceDir).length + 1);
    });

    it('reports unknown names and copies nothing when none match', () => {
        const result = add(['Nope'], { sourceDir, targetDir: join(dir, 'volt') });

        expect(result.unknown).toEqual(['Nope']);
        expect(result.added).toEqual([]);
        expect(readdirSync(dir)).toEqual([]);
    });

    it('keeps existing files unless overwrite is on', () => {
        writeFileSync(join(dir, 'Button.vue'), 'customized');

        expect(add(['Button'], { sourceDir, targetDir: dir }).skipped).toEqual(['Button.vue']);
        expect(readFileSync(join(dir, 'Button.vue'), 'utf8')).toBe('customized');

        add(['Button'], { sourceDir, targetDir: dir, overwrite: true });
        expect(readFileSync(join(dir, 'Button.vue'), 'utf8')).not.toBe('customized');
    });

    it('only reports dependencies that were actually written', () => {
        writeFileSync(join(dir, 'SecondaryButton.vue'), 'customized');

        expect(add(['Toast'], { sourceDir, targetDir: dir }).dependencies).toEqual([]);
    });

    it('lists the npm packages the copied files import', () => {
        expect(add(['Button'], { sourceDir, targetDir: dir }).packages).toEqual(['openvue', 'tailwind-merge']);
    });
});

describe('missingPackages', () => {
    it('returns the packages package.json does not declare', () => {
        writeFileSync(join(dir, 'package.json'), JSON.stringify({ dependencies: { openvue: '^1.0.0' } }));

        expect(missingPackages(dir, ['openvue', 'tailwind-merge'])).toEqual(['tailwind-merge']);
    });
});
