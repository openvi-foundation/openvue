# @openvue/migrate

Codemod that migrates a PrimeVue project to [OpenVue](https://github.com/openvi-foundation/openvue). OpenVue keeps PrimeVue's public API unchanged (`usePrimeVue`, `PrimeVueResolver`, the `primevue` Nuxt config key, `p-` CSS classes, pass-through options), so migrating is a package rename — which is exactly and only what this tool does.

## Usage

One command, from the root of your project (for monorepos, run it at the workspace root so overrides land in the right place):

```sh
npx @openvue/migrate
```

It rewrites dependencies and source files, then runs your package manager's install (detected from the lockfile) so the migrated project builds immediately.

**Already installed OpenVue yourself?** If `openvue` is found in your `package.json` or `node_modules`, the tool switches to sources-only mode: dependencies and `node_modules` are left completely untouched, no install runs, and only source-file imports are rewritten.

| Option         | Description                                              |
| -------------- | -------------------------------------------------------- |
| `[dir]`        | Directory to migrate (defaults to the current directory) |
| `--dry`        | Report what would change without writing any files       |
| `--no-install` | Skip the package manager install after rewriting         |
| `--no-alias`   | Do not add the `primevue` -> `openvue` override          |
| `--force`      | Run even if the git working tree has uncommitted changes |

The tool refuses to run on a dirty git tree by default, so the migration is always a single reviewable, revertible diff.

## What it does

1. **Renames dependencies** in every `package.json` (monorepos supported): `dependencies`, `devDependencies`, `peerDependencies`, `optionalDependencies`, `peerDependenciesMeta`, `resolutions`, `overrides` and `pnpm.overrides`, including selector keys like `**/primevue` or `primevue@^4`. `workspace:`/`catalog:`/`npm:` protocol values are preserved, and `pnpm-workspace.yaml` catalogs are rewritten too. If both `primevue` and `openvue` entries exist, yours wins and the leftover is removed.
2. **Rewrites module specifiers** in `.js`, `.mjs`, `.cjs`, `.ts`, `.mts`, `.cts`, `.jsx`, `.tsx`, `.vue`, `.astro` and `.mdx` files — static imports, `import type`, `require()`, dynamic `import()`, Nuxt `modules` arrays, Vite `optimizeDeps`/`transpile` entries, and generated `components.d.ts` files. Subpath (`primevue/button`) and scoped (`@primevue/*`) specifiers are unambiguous and rewritten anywhere; a bare `'primevue'` string is only rewritten in import positions (or anywhere in `*.config.*` files), so runtime data like `provider: 'primevue'` is never touched.
3. **Adds a compatibility override** (`"primevue": "npm:openvue@<version>"` — in `overrides`, `pnpm.overrides` or `resolutions` depending on your package manager) so third-party libraries that depend or peer-depend on `primevue` resolve to OpenVue. Remove it once your whole dependency graph is OpenVue-native, or skip it with `--no-alias`.
4. **Audits what's left**: after rewriting, it scans sources, styles, HTML and tsconfig files for surviving PrimeVue references (interpolated `import(\`primevue/${name}\`)`, CSS `@import`s, CDN urls, tsconfig `paths`) and lists each one with file and line, so it never reports success while actionable references remain.

The rename mapping:

| From                                                                                                                                                                         | To                            |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `primevue`, `primevue/*`                                                                                                                                                     | `openvue`, `openvue/*`        |
| `@primevue/core`, `@primevue/forms`, `@primevue/icons`, `@primevue/themes`, `@primevue/nuxt-module`, `@primevue/auto-import-resolver`, `@primevue/metadata`, `@primevue/mcp` | same names under `@openvue/*` |

Left untouched on purpose — OpenVue still uses these upstream packages: `@primeuix/*`, `primeicons`, `primeflex`, `tailwindcss-primeui`. The `primevue` Nuxt config key also stays, because OpenVue's Nuxt module kept it.

Renamed dependencies are pinned to the exact OpenVue version while OpenVue is in alpha; once stable releases start, the codemod will emit caret ranges instead.

## Try OpenVue without changing any code

If you just want to evaluate OpenVue first, add only the override yourself instead of running the codemod — no source changes needed:

```jsonc
// package.json (npm / bun; use pnpm.overrides for pnpm, resolutions for yarn)
{
    "overrides": {
        "primevue": "npm:openvue@0.0.1-alpha.1"
    }
}
```

Once you decide to stay, run `npx @openvue/migrate` for the real rename.

## Requirements

- Node.js 18+
- Your project should be on PrimeVue 4.x (the fork point). Coming from v3 or earlier, apply the [PrimeVue v4 migration guide](https://primevue.org/guides/migration/v4/) as well — this tool warns you if it detects a pre-4.x version.
