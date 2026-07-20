import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Fails the build when a packages/*/dist artifact still references the old
// package names. Published npm content is immutable, so a residual that
// slips into a release can only be fixed by a full version bump — catch it here.

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGES_DIR = path.resolve(__dirname, '../packages');

const CODE_EXTENSIONS = new Set(['.js', '.mjs', '.cjs', '.ts', '.mts', '.cts', '.vue', '.json']);
const RESIDUAL_PATTERNS = [
    { name: 'scoped specifier', regex: /['"`]@primevue\// },
    { name: 'subpath specifier', regex: /['"`]primevue\// },
    { name: 'bare import', regex: /(?:\bfrom|\brequire\s*\(|\bimport\s*\()\s*['"`]primevue['"`]/ }
];

function* walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);

        if (entry.isDirectory()) yield* walk(full);
        else yield full;
    }
}

const findings = [];

// the migrate codemod legitimately contains primevue string literals — it renames them
const EXCLUDED_PACKAGES = new Set(['migrate']);

for (const pkg of fs.readdirSync(PACKAGES_DIR, { withFileTypes: true })) {
    if (!pkg.isDirectory() || EXCLUDED_PACKAGES.has(pkg.name)) continue;

    const dist = path.join(PACKAGES_DIR, pkg.name, 'dist');

    if (!fs.existsSync(dist)) continue;

    for (const file of walk(dist)) {
        if (file.endsWith('.map') || !CODE_EXTENSIONS.has(path.extname(file))) continue;

        const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);

        lines.forEach((line, i) => {
            for (const { name, regex } of RESIDUAL_PATTERNS) {
                if (regex.test(line)) {
                    findings.push(`${path.relative(PACKAGES_DIR, file)}:${i + 1} [${name}] ${line.trim().slice(0, 120)}`);
                    break;
                }
            }
        });
    }
}

if (findings.length) {
    console.error(`verify-dist: found ${findings.length} residual primevue reference(s) in built packages:\n`);
    findings.forEach((f) => console.error(`  ${f}`));
    console.error('\nThese would ship broken imports to npm. Fix the source or generator that produced them and rebuild.');
    process.exit(1);
}

console.log('verify-dist: all package dists are clean.');
