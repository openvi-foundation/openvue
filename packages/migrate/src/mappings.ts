import { readFileSync } from 'node:fs';

// The version of openvue to install; @openvue/* packages are released in lockstep with this package.
export const OPENVUE_VERSION: string = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version;

// @primevue/* packages published at the fork point. Anything else under the scope is left untouched and reported.
export const SCOPED_PACKAGES = ['core', 'forms', 'icons', 'themes', 'nuxt-module', 'auto-import-resolver', 'metadata', 'mcp'];

// Packages OpenVue still depends on upstream — the codemod must never rewrite these.
// Kept here as documentation of intent; matching below is anchored so they can't match anyway.
export const UNTOUCHED_PACKAGES = ['@primeuix/*', 'primeicons', 'primeflex', 'tailwindcss-primeui'];

/**
 * Maps a PrimeVue module specifier or package name to its OpenVue equivalent.
 * Returns null when the specifier is not a PrimeVue package (or not one that exists in OpenVue).
 */
export function renameSpecifier(specifier: string): string | null {
    if (specifier === 'primevue') return 'openvue';
    if (specifier.startsWith('primevue/')) return 'openvue' + specifier.slice('primevue'.length);

    if (specifier.startsWith('@primevue/')) {
        const rest = specifier.slice('@primevue/'.length);
        const name = rest.split('/')[0];

        if (SCOPED_PACKAGES.includes(name)) return '@openvue/' + rest;
    }

    return null;
}

export function isUnknownScopedPackage(specifier: string): boolean {
    return specifier.startsWith('@primevue/') && renameSpecifier(specifier) === null;
}
