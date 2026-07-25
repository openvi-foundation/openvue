# Migration from PrimeVue v4

Move an existing PrimeVue v4 project to OpenVue with one command.

## Options

Option Description [dir] Directory to migrate (defaults to the current directory) --mode &lt;mode&gt; full , files-only or dry ; runs without prompting --dry Report what would change without writing any files --no-install Rewrite files but do not run the package manager install --no-alias Do not add the primevue to openvue override --force Do not stop on an uncommitted git working tree --yes , -y Skip prompts and use defaults (full migration) In interactive mode a dirty git tree only asks for confirmation. Non-interactively — with a mode flag, --yes or in CI — it stops unless you pass --force , so the migration stays a single reviewable, revertible diff.

## Overview

OpenVue is a fork of PrimeVue v4 that keeps the public API unchanged — usePrimeVue , PrimeVueResolver , the primevue Nuxt config key, p- prefixed CSS classes and pass-through options all work exactly as before. Migrating is therefore a package rename, which is exactly and only what @openvue/migrate does: an automated codemod that rewrites your project's imports and package references from PrimeVue to OpenVue. The tool is ready to use. It handles Vite, Nuxt and Laravel projects, monorepos included, and always shows you what it will change before touching a single file.

## Requirements

Node.js 18 or newer. Your project must be on PrimeVue 4.x, the fork point. The tool detects the installed major — from package.json , a catalog: or workspace: protocol, node_modules or the lockfile — and stops without changing anything if it finds a non-4.x version. Coming from v3 or earlier, apply the PrimeVue v4 migration guide first, then run the tool.

## Try Without Migrating

If you just want to evaluate OpenVue first, add only the compatibility override yourself instead of running the codemod — no source changes needed. Use overrides for npm and bun, pnpm.overrides for pnpm, or resolutions for yarn. Once you decide to stay, run npx @openvue/migrate for the real rename.

```vue
{
    "overrides": {
        "primevue": "npm:openvue@0.0.1-beta.0"
    }
}
```

## Usage

Migration is a single command, run from the root of your project. For monorepos, run it at the workspace root so overrides land in the right place. Run in a terminal, it shows a plan — detected package manager, PrimeVue version, the files and references it will change, and your git status — then asks how to proceed: Full migration — rewrite files, add the compatibility override, and run your package manager's install (detected from the lockfile) so the project builds immediately. Files only — rewrite files and dependencies but leave node_modules alone; you run the install yourself. Dry run — show everything, write nothing. Pass a mode flag ( --mode , --dry , --no-install ) or --yes to skip the prompt; any non-terminal run such as CI or piped output is non-interactive as well. Already installed OpenVue yourself? If openvue is found in your package.json or node_modules , the tool switches to sources-only mode: dependencies and node_modules are left completely untouched, no install runs, and only source-file imports are rewritten.

```vue
npx @openvue/migrate
```

## What It Does

Renames dependencies in every package.json , monorepos included — dependencies , devDependencies , peerDependencies , optionalDependencies , resolutions , overrides and pnpm.overrides , including selector keys like **&#47;primevue or primevue@^4 . workspace: , catalog: and npm: protocol values are preserved, and pnpm-workspace.yaml catalogs are rewritten too. Rewrites module specifiers in .js , .ts , .vue , .jsx , .tsx , .astro , .mdx and related files — static imports, import type , require() , dynamic import() , Nuxt modules arrays, Vite optimizeDeps and transpile entries, and generated components.d.ts files. A bare primevue string is only rewritten in import positions, so runtime data like provider: 'primevue' is never touched. Adds a compatibility override — "primevue": "npm:openvue@&lt;version&gt;" — so third-party libraries that depend or peer-depend on primevue resolve to OpenVue. Remove it once your whole dependency graph is OpenVue-native, or skip it with --no-alias . Audits what's left — after rewriting, it scans sources, styles, HTML and tsconfig files for surviving PrimeVue references and lists each one with file and line, so it never reports success while actionable references remain. The rename mapping: From To primevue , primevue/* openvue , openvue/* @primevue/core , @primevue/forms , @primevue/icons , @primevue/themes , @primevue/nuxt-module , @primevue/auto-import-resolver , @primevue/metadata , @primevue/mcp same names under @openvue/*

