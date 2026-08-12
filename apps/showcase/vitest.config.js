import path from 'path';
import { defineConfig } from 'vitest/config';

/*
 * The showcase is a Nuxt app and is not unit tested as a whole. This config exists for the few
 * pieces that are plain modules with rules worth pinning — the playground schemas, which are
 * derived from the generated apidoc and so can break without anyone touching them.
 *
 * vitest is deliberately not a dependency of this package: it reaches the showcase through the
 * workspace root, where packages/migrate and packages/nuxt-module already put it. If `test:unit`
 * ever fails to find the binary, that is why, and declaring it here plus a `pnpm install` is the fix.
 */
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '.')
        }
    },
    test: {
        globals: true,
        environment: 'node',
        include: ['components/**/*.spec.js', 'doc/**/*.spec.js']
    }
});
