import { readFileSync } from 'node:fs';

// The version of openvue to install; @openvue/* packages are released in lockstep with this package.
export const OPENVUE_VERSION: string = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version;

// The @openuxkit/* engine packages (the fork of @primeuix/*) version independently of openvue,
// so renamed @openuxkit deps are pinned to this range rather than OPENVUE_VERSION. Bump when the
// openux fork advances past its alpha line.
export const OPENUXKIT_VERSION = '^0.0.1-alpha.1';

// @primevue/* packages published at the fork point. Anything else under the scope is left untouched and reported.
export const SCOPED_PACKAGES = ['core', 'forms', 'icons', 'themes', 'nuxt-module', 'auto-import-resolver', 'metadata', 'mcp'];

// Packages left untouched by the migration — OpenVue does not fork these.
export const UNTOUCHED_PACKAGES = ['primeicons', 'primeflex', 'tailwindcss-primeui'];

/**
 * Maps a PrimeVue / PrimeUIX module specifier or package name to its OpenVue equivalent.
 * Returns null when the specifier is not one OpenVue provides a replacement for.
 */
export function renameSpecifier(specifier: string): string | null {
    if (specifier === 'primevue') return 'openvue';
    if (specifier.startsWith('primevue/')) return 'openvue' + specifier.slice('primevue'.length);

    if (specifier.startsWith('@primevue/')) {
        const rest = specifier.slice('@primevue/'.length);
        const name = rest.split('/')[0];

        if (SCOPED_PACKAGES.includes(name)) return '@openvue/' + rest;
    }

    // @primeuix/themes holds the design-token presets; OpenVue ships these as @openvue/themes.
    if (specifier === '@primeuix/themes') return '@openvue/themes';
    if (specifier.startsWith('@primeuix/themes/')) return '@openvue/themes' + specifier.slice('@primeuix/themes'.length);

    // The remaining @primeuix/* engine packages (styled, utils, styles, forms, mcp) are forked as @openuxkit/*.
    if (specifier.startsWith('@primeuix/')) return '@openuxkit/' + specifier.slice('@primeuix/'.length);

    return null;
}

/**
 * The version range to pin a renamed dependency to: @openuxkit/* tracks its own release line,
 * everything else (openvue, @openvue/*) is released in lockstep with OPENVUE_VERSION.
 */
export function versionForRenamed(name: string): string {
    return name.startsWith('@openuxkit/') ? OPENUXKIT_VERSION : OPENVUE_VERSION;
}

export function isUnknownScopedPackage(specifier: string): boolean {
    return specifier.startsWith('@primevue/') && renameSpecifier(specifier) === null;
}
