import path from 'path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

/*
 * The showcase is a Nuxt app and is not unit tested as a whole. This config exists for the few
 * pieces that are plain modules with rules worth pinning — the playground schemas, which are
 * derived from the generated apidoc and so can break without anyone touching them.
 * The designer services share this config so the normal test command covers both suites.
 */
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '.')
        }
    },
    test: {
        globals: true,
        environment: 'node',
        include: ['components/**/*.spec.js', 'doc/**/*.spec.js', 'test/**/*.spec.js']
    }
});
