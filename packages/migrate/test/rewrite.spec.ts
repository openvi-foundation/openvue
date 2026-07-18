import { describe, expect, it } from 'vitest';
import { OPENVUE_VERSION, renameSpecifier } from '../src/mappings';
import { addCompatAlias, rewritePackageJson, rewriteSource, rewriteWorkspaceYaml } from '../src/rewrite';

describe('renameSpecifier', () => {
    it('renames the main package and subpaths', () => {
        expect(renameSpecifier('primevue')).toBe('openvue');
        expect(renameSpecifier('primevue/button')).toBe('openvue/button');
        expect(renameSpecifier('primevue/config')).toBe('openvue/config');
    });

    it('renames known scoped packages', () => {
        expect(renameSpecifier('@primevue/themes')).toBe('@openvue/themes');
        expect(renameSpecifier('@primevue/nuxt-module')).toBe('@openvue/nuxt-module');
        expect(renameSpecifier('@primevue/themes/aura')).toBe('@openvue/themes/aura');
        expect(renameSpecifier('@primevue/mcp')).toBe('@openvue/mcp');
    });

    it('leaves everything else alone', () => {
        expect(renameSpecifier('primeicons')).toBeNull();
        expect(renameSpecifier('primeicons/primeicons.css')).toBeNull();
        expect(renameSpecifier('@primeuix/themes/aura')).toBeNull();
        expect(renameSpecifier('tailwindcss-primeui')).toBeNull();
        expect(renameSpecifier('primeflex')).toBeNull();
        expect(renameSpecifier('primevue-community-addon')).toBeNull();
        expect(renameSpecifier('@primevue/unknown-package')).toBeNull();
    });
});

describe('rewriteSource', () => {
    it('rewrites static, dynamic, type-only and require imports', () => {
        const input = [
            `import PrimeVue from 'primevue/config';`,
            `import Button from "primevue/button";`,
            `import type { ButtonProps } from 'primevue/button';`,
            `export { default as Chip } from 'primevue/chip';`,
            `const Dialog = await import('primevue/dialog');`,
            `const forms = require('@primevue/forms');`
        ].join('\n');

        const result = rewriteSource(input);

        expect(result.count).toBe(6);
        expect(result.code).toContain(`from 'openvue/config'`);
        expect(result.code).toContain(`from "openvue/button"`);
        expect(result.code).toContain(`import('openvue/dialog')`);
        expect(result.code).toContain(`require('@openvue/forms')`);
        expect(result.code).not.toContain('primevue');
    });

    it('rewrites a bare primevue specifier only in import context', () => {
        const input = [`import PrimeVue from 'primevue';`, `const lib = require('primevue');`, `const provider = 'primevue';`, `track({ source: "primevue" });`].join('\n');

        const result = rewriteSource(input);

        expect(result.count).toBe(2);
        expect(result.code).toContain(`from 'openvue';`);
        expect(result.code).toContain(`require('openvue')`);
        expect(result.code).toContain(`const provider = 'primevue';`);
        expect(result.code).toContain(`track({ source: "primevue" });`);
    });

    it('rewrites config-file string entries anywhere (Nuxt modules, transpile, optimizeDeps)', () => {
        const input = [`export default { modules: ['@primevue/nuxt-module'], build: { transpile: ['primevue'] } };`, `const deps = { include: ['primevue/button', 'quill'] };`].join('\n');

        const result = rewriteSource(input, { configFile: true });

        expect(result.code).toContain(`modules: ['@openvue/nuxt-module']`);
        expect(result.code).toContain(`transpile: ['openvue']`);
        expect(result.code).toContain(`include: ['openvue/button', 'quill']`);
    });

    it('leaves untouched packages and lookalike specifiers alone', () => {
        const input = [`import 'primeicons/primeicons.css';`, `import Aura from '@primeuix/themes/aura';`, `import addon from 'primevue-community-addon';`, `const plugin = require('tailwindcss-primeui');`].join('\n');

        const result = rewriteSource(input);

        expect(result.count).toBe(0);
        expect(result.code).toBe(input);
    });

    it('skips a quoted primevue object key (Nuxt config key) and reports it', () => {
        const input = `export default defineNuxtConfig({ 'primevue': { options: { ripple: true } } });`;
        const result = rewriteSource(input, { configFile: true });

        expect(result.count).toBe(0);
        expect(result.code).toBe(input);
        expect(result.skippedKeys).toEqual(['primevue']);
    });

    it('reports unknown @primevue packages without touching them', () => {
        const input = `import x from '@primevue/does-not-exist';`;
        const result = rewriteSource(input);

        expect(result.count).toBe(0);
        expect(result.code).toBe(input);
        expect(result.unknownScoped).toEqual(['@primevue/does-not-exist']);
    });

    it('rewrites plain template literals but not interpolated ones', () => {
        const input = 'const a = await import(`primevue/button`);\nconst b = await import(`primevue/${name}`);';
        const result = rewriteSource(input);

        expect(result.count).toBe(1);
        expect(result.code).toContain('import(`openvue/button`)');
        expect(result.code).toContain('import(`primevue/${name}`)');
    });
});

describe('rewritePackageJson', () => {
    it('renames dependencies across sections and sets the OpenVue version', () => {
        const input = JSON.stringify(
            {
                dependencies: { primevue: '^4.3.3', primeicons: '^7.0.0', '@primeuix/themes': '^2.0.3' },
                devDependencies: { '@primevue/auto-import-resolver': '^4.3.3' }
            },
            null,
            4
        );

        const result = rewritePackageJson(input);
        const pkg = JSON.parse(result.text);

        expect(result.changed).toBe(true);
        expect(result.oldPrimevueRange).toBe('^4.3.3');
        expect(pkg.dependencies.openvue).toBe(OPENVUE_VERSION);
        expect(pkg.dependencies.primevue).toBeUndefined();
        expect(pkg.dependencies.primeicons).toBe('^7.0.0');
        expect(pkg.dependencies['@primeuix/themes']).toBe('^2.0.3');
        expect(pkg.devDependencies['@openvue/auto-import-resolver']).toBe(OPENVUE_VERSION);
    });

    it('preserves key order, indentation and protocol values', () => {
        const input = '{\n    "dependencies": {\n        "vue": "^3.4.0",\n        "primevue": "workspace:*",\n        "zod": "^3.0.0"\n    }\n}\n';
        const result = rewritePackageJson(input);

        expect(result.text).toBe('{\n    "dependencies": {\n        "vue": "^3.4.0",\n        "openvue": "workspace:*",\n        "zod": "^3.0.0"\n    }\n}\n');
    });

    it('keeps an existing openvue entry instead of overwriting it', () => {
        const input = JSON.stringify({ dependencies: { primevue: '^4.3.3', openvue: '0.0.1-alpha.9' } });
        const result = rewritePackageJson(input);
        const pkg = JSON.parse(result.text);

        expect(pkg.dependencies).toEqual({ openvue: '0.0.1-alpha.9' });
        expect(result.notes).toEqual(['kept existing openvue entry and removed primevue']);
    });

    it('renames peerDependenciesMeta keys without altering their values', () => {
        const input = JSON.stringify({ peerDependencies: { primevue: '^4.0.0' }, peerDependenciesMeta: { primevue: { optional: true } } });
        const result = rewritePackageJson(input);
        const pkg = JSON.parse(result.text);

        expect(pkg.peerDependencies).toEqual({ openvue: OPENVUE_VERSION });
        expect(pkg.peerDependenciesMeta).toEqual({ openvue: { optional: true } });
    });

    it('renames selector keys in overrides and resolutions', () => {
        const input = JSON.stringify({ resolutions: { '**/primevue': '^4.0.0', 'some-lib/@primevue/themes': '^4.0.0' }, overrides: { 'primevue@^4': '^4.3.0' } });
        const result = rewritePackageJson(input);
        const pkg = JSON.parse(result.text);

        expect(pkg.resolutions).toEqual({ '**/openvue': OPENVUE_VERSION, 'some-lib/@openvue/themes': OPENVUE_VERSION });
        expect(pkg.overrides).toEqual({ openvue: OPENVUE_VERSION });
    });

    it('renames nested npm overrides', () => {
        const input = JSON.stringify({ overrides: { 'some-lib': { primevue: '^4.0.0' } } });
        const result = rewritePackageJson(input);
        const pkg = JSON.parse(result.text);

        expect(pkg.overrides['some-lib'].openvue).toBe(OPENVUE_VERSION);
    });

    it('renames pnpm.overrides', () => {
        const input = JSON.stringify({ pnpm: { overrides: { '@primevue/themes': '^4.3.3' } } });
        const result = rewritePackageJson(input);
        const pkg = JSON.parse(result.text);

        expect(pkg.pnpm.overrides['@openvue/themes']).toBe(OPENVUE_VERSION);
    });

    it('reports no change for unrelated files', () => {
        const input = JSON.stringify({ dependencies: { vue: '^3.4.0' } });
        const result = rewritePackageJson(input);

        expect(result.changed).toBe(false);
        expect(result.text).toBe(input);
    });
});

describe('addCompatAlias', () => {
    const alias = `npm:openvue@${OPENVUE_VERSION}`;

    it('adds an npm/bun override', () => {
        const result = addCompatAlias('{}', 'npm');

        expect(result.added).toBe(true);
        expect(JSON.parse(result.text).overrides).toEqual({ primevue: alias });
    });

    it('adds a pnpm override', () => {
        const result = addCompatAlias('{}', 'pnpm');

        expect(JSON.parse(result.text).pnpm.overrides).toEqual({ primevue: alias });
    });

    it('adds a yarn resolution', () => {
        const result = addCompatAlias('{}', 'yarn');

        expect(JSON.parse(result.text).resolutions).toEqual({ primevue: alias });
    });

    it('does not clobber an existing primevue override', () => {
        const input = JSON.stringify({ overrides: { primevue: 'npm:openvue@0.0.1-alpha.9' } });
        const result = addCompatAlias(input, 'npm');

        expect(result.added).toBe(false);
        expect(result.text).toBe(input);
    });
});

describe('rewriteWorkspaceYaml', () => {
    it('rewrites catalog entries and leaves upstream packages alone', () => {
        const input = ['catalog:', `    'primevue': ^4.3.3`, `    '@primevue/themes': ^4.3.3`, `    '@primeuix/utils': ^0.6.2`, `    'primeicons': ^7.0.0`, ''].join('\n');
        const result = rewriteWorkspaceYaml(input);

        expect(result.count).toBe(2);
        expect(result.text).toContain(`'openvue': ${OPENVUE_VERSION}`);
        expect(result.text).toContain(`'@openvue/themes': ${OPENVUE_VERSION}`);
        expect(result.text).toContain(`'@primeuix/utils': ^0.6.2`);
        expect(result.text).toContain(`'primeicons': ^7.0.0`);
    });

    it('does not touch workspace package path lists', () => {
        const input = ['packages:', `    - 'packages/primevue'`, `    - 'apps/*'`, ''].join('\n');
        const result = rewriteWorkspaceYaml(input);

        expect(result.count).toBe(0);
        expect(result.text).toBe(input);
    });
});
