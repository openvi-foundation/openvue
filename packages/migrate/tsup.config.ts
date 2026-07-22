import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['./src/index.ts'],
    format: ['esm'],
    dts: true,
    splitting: false,
    clean: true,
    shims: true,
    // Bundle the CLI's interactive-prompt libraries so the published package stays dependency-free
    // and `npx @openvue/migrate` starts without resolving anything.
    noExternal: ['@clack/prompts', 'picocolors'],
    banner: {
        js: '#!/usr/bin/env node'
    }
});
