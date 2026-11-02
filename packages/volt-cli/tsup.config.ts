import { cpSync } from 'node:fs';
import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['./src/index.ts'],
    format: ['esm'],
    dts: true,
    splitting: false,
    clean: true,
    shims: true,
    banner: {
        js: '#!/usr/bin/env node'
    },
    // Ship the OpenVolt components from this same commit, so every CLI release adds exactly the
    // files that match the openvue release it was published with. No git or network at run time.
    onSuccess: async () => {
        cpSync('../../apps/volt/volt', './dist/components', { recursive: true });
    }
});
