import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const EXCLUDED_DIRS = new Set(['node_modules', 'vendor', 'dist', 'build', 'coverage', '.git', '.nuxt', '.output', '.next', '.vite', '.cache', '.turbo']);

/**
 * Recursively lists files under `dir`, skipping directories that never contain user source.
 */
export function walk(dir: string): string[] {
    const files: string[] = [];

    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
            if (!EXCLUDED_DIRS.has(entry.name)) files.push(...walk(join(dir, entry.name)));
        } else if (entry.isFile()) {
            files.push(join(dir, entry.name));
        }
    }

    return files;
}
