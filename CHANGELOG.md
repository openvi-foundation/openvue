# Changelog

All notable changes to OpenVue are documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

OpenVue forked from PrimeVue at 4.5.5. Pre-fork history is in [CHANGELOG_PRIMEVUE.md](CHANGELOG_PRIMEVUE.md) and [CHANGELOG_ARCHIVE.md](CHANGELOG_ARCHIVE.md).

All packages in this repository are released together under a single version.

## [Unreleased]

### Changed

- Documentation links in TypeScript definitions now point to openvue.dev instead of primevue.org, so editor tooltips reference the maintained docs.

### Added

- `SECURITY.md` describing how to report a vulnerability.
- `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1).
- This changelog, backfilled with the release history from alpha.1 onward.

## [0.0.1-beta.1] - 2026-07-27

### Changed

- Replaced the `@primeuix/*` engine dependencies with the forked `@openuxkit/*` packages (`styled`, `utils`, `styles`, `themes`, `forms`, `mcp`), completing the move off upstream packages. Theme presets and the public theming API continue to come from `@openvue/themes`; `@openuxkit/themes` supplies `/tokens` and `/types`.
- `@openvue/migrate` now rewrites `@primeuix/*` imports to `@openuxkit/*` as part of a migration.
- Showcase theming documentation updated for the OpenUXKit packages.

## [0.0.1-beta.0] - 2026-07-23

### Changed

- Promoted the packages from alpha to beta. The component API is considered stable from this point; remaining work is polish toward a stable release.
- Refined the `@openvue/migrate` CLI output and styling.

### Fixed

- Typo on the showcase About page.

## [0.0.1-alpha.5] - 2026-07-23

### Added

- End-to-end consumer test suite covering real Vite, Nuxt, Laravel (Vite and Inertia), and Volt projects, exercised in CI on every pull request. Packages are packed as tarballs and installed the way a consumer would install them.
- `scripts/verify-package-contracts.mjs` and `scripts/verify-dist.mjs`, which fail the build if a published artifact still references `primevue`.

### Changed

- `@openvue/migrate` is now interactive: it prints a plan covering the detected package manager, the PrimeVue version, and every file it will touch, then asks for confirmation before writing.

## [0.0.1-alpha.4] - 2026-07-20

### Added

- UMD build and CDN support, so OpenVue can be used from a `<script>` tag without a bundler.
- CDN setup documentation on the showcase.

## [0.0.1-alpha.3] - 2026-07-20

### Fixed

- `@openvue/auto-import-resolver` resolved components to `primevue/...` paths instead of `openvue/...`.
- The `openvue` root barrel (`index.mjs` / `index.d.ts`) still self-referenced `primevue/...`, which broke Vite resolution and produced `Module '"openvue"' has no exported member 'useToast'` under `tsc`.
- The `@openvue/icons` barrel generator still emitted `@primevue/icons/...` templates, regenerating a broken barrel on every build.

## [0.0.1-alpha.2] - 2026-07-17

### Added

- Announcement page on openvue.dev covering the fork, the roadmap, and install instructions.

## [0.0.1-alpha.1] - 2026-07-17

First OpenVue release, forked from PrimeVue 4.5.5.

### Added

- `@openvue/migrate`, a CLI that moves a PrimeVue v4 project to OpenVue in one command. It renames dependencies, rewrites imports across JavaScript, TypeScript, Vue, Astro, and MDX, adds a compatibility override so third-party packages that still depend on PrimeVue keep resolving, and reports anything needing manual attention. Supports npm, pnpm, Yarn, Bun, and monorepos, with `--dry`, sources-only, no-install, no-alias, and force modes. Refuses to run against a dirty Git tree unless forced.
- Contributing guide and OpenVue issue templates.

### Changed

- Renamed the published packages: `primevue` is now `openvue`, and `@primevue/*` is now `@openvue/*`.
- Rebranded the showcase as OpenVue, with a fork notice explaining the project's relationship to PrimeVue, and removed the PrimeTek commercial pages and assets.
- License copyright updated for the fork. The project remains MIT.

[unreleased]: https://github.com/openvi-foundation/openvue/compare/0.0.1-beta.1...HEAD
[0.0.1-beta.1]: https://github.com/openvi-foundation/openvue/compare/0.0.1-beta.0...0.0.1-beta.1
[0.0.1-beta.0]: https://github.com/openvi-foundation/openvue/compare/0.0.1-alpha.5...0.0.1-beta.0
[0.0.1-alpha.5]: https://github.com/openvi-foundation/openvue/compare/0.0.1-alpha.4...0.0.1-alpha.5
[0.0.1-alpha.4]: https://github.com/openvi-foundation/openvue/compare/0.0.1-alpha.3...0.0.1-alpha.4
[0.0.1-alpha.3]: https://github.com/openvi-foundation/openvue/compare/0.0.1-alpha.2...0.0.1-alpha.3
[0.0.1-alpha.2]: https://github.com/openvi-foundation/openvue/compare/0.0.1-alpha.1...0.0.1-alpha.2
[0.0.1-alpha.1]: https://github.com/openvi-foundation/openvue/releases/tag/0.0.1-alpha.1
