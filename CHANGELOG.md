# Changelog

All notable changes to OpenVue are documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

OpenVue forked from PrimeVue at 4.5.5. Pre-fork history is in [CHANGELOG_PRIMEVUE.md](CHANGELOG_PRIMEVUE.md) and [CHANGELOG_ARCHIVE.md](CHANGELOG_ARCHIVE.md).

All packages in this repository are released together under a single version.

## [Unreleased]
- Volt UI fork of OpenVue

### Changed

- `@openvue/migrate` no longer adds an automatic `primevue` -> `openvue` dependency override. It is not needed for a normal migration; add one yourself if a leftover package still requires `primevue`. ([#639](https://github.com/openvi-foundation/openvue/issues/639))

## [1.0.0-rc.0] - 2026-08-18

The first release candidate. The version moves from `0.7.0-beta.0` to `1.0.0-rc.0`: the public API is what we intend to ship as 1.0, and from here we only take bug fixes and documentation until the stable release. Packages are published under the `rc` dist-tag. Report anything that looks like a regression, that is exactly what a release candidate is for.

### Added

- `VirtualScroller` gains a `getItemSize` prop, a callback that returns an item's height by index, so a list whose rows are not all the same height can still be virtualized. ([#621](https://github.com/openvi-foundation/openvue/pull/621))
- Showcase: a Playground tab on the form components, the button components, and the panel components (Accordion, Card, DeferredContent, Divider, Fieldset, Panel, ScrollPanel, Splitter, Stepper, Tabs and Toolbar). Each one generates the code for whatever you set up in it, as a complete single file component in both the Composition and Options API. ([#622](https://github.com/openvi-foundation/openvue/pull/622), [#623](https://github.com/openvi-foundation/openvue/pull/623), [#624](https://github.com/openvi-foundation/openvue/pull/624))
- Showcase: a guide for migrating charts from PrimeVue.

### Changed

- The `@openuxkit/*` engine packages are upgraded to 1.0.0.
- Showcase: the icons page is built on `@openvue/openicons` and restructured around the two OpenIcons formats. ([#37](https://github.com/openvi-foundation/openvue/pull/37))
- Showcase: the introduction and contribution pages are rewritten, and Components now sits above Configuration in the sidebar.

### Fixed

- `DataTable` supports subheader row grouping together with virtual scrolling. Group headers and footers are measured rather than assumed to be the same height as a row, so grouped rows no longer drift out of position while scrolling. Contributed by [@Tamas-hi](https://github.com/Tamas-hi). ([#621](https://github.com/openvi-foundation/openvue/pull/621))
- `BlockUI` always removes its mask when unblocked. Blocking and unblocking in quick succession, or unmounting the component while the leave animation was still running, could leave a mask covering the page and swallowing every click. The mask is now also cleaned up when the component unmounts. ([#626](https://github.com/openvi-foundation/openvue/pull/626))
- Showcase: the `Toast` documentation covers removing a single message by its id, and the Multiple demo no longer calls a method that does not exist. ([#628](https://github.com/openvi-foundation/openvue/pull/628), [#629](https://github.com/openvi-foundation/openvue/pull/629))
- `DataTable`'s advanced filter menu stays open while you use an overlay inside it, such as the match mode `Select`, a `MultiSelect` or a `DatePicker`. The menu recognises a nested overlay through its attribute selector, so being appended to the body no longer makes it look like an outside click. `Select` additionally announces the interaction on mousedown, since it commits an option and hides its overlay before the browser dispatches the click, which also fixes a `Select` nested in a `Popover`. ([#630](https://github.com/openvi-foundation/openvue/issues/630))

## [0.7.0-beta.0] - 2026-08-03

The version jumps from `0.0.1-beta.1` to `0.7.0-beta.0` to reflect the project's actual maturity. Nothing was released between the two. Packages remain pre-1.0 and continue to be published under the `beta` dist-tag.

### Added

- `Chart` now follows the active theme, reading colors, fonts, grid and border values from the design tokens instead of relying on Chart.js defaults, and restyling itself when the preset changes or dark mode is toggled. Controlled by a new `themed` prop, enabled by default.
- `Chart` ships TypeScript definitions.
- `Password` gains `showPasswordLabel` and `hidePasswordLabel` props for labelling the mask toggle.
- `chart.js` and `quill` are declared as optional `peerDependencies`, so package managers surface the expected version instead of leaving it undocumented.
- `Chart` logs an actionable error when `chart.js` is not installed, rather than failing silently.
- Showcase: a chart playground covering every chart type, a reworked landing hero, topbar and footer, and an About page.
- `SECURITY.md` describing how to report a vulnerability.
- `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1).
- This changelog, backfilled with the release history from alpha.1 onward.

### Changed

- Documentation links in TypeScript definitions now point to openvue.dev instead of primevue.org, so editor tooltips reference the maintained docs.
- `Chart` requires Chart.js 4.5 or newer.
- Charts pick up a default look derived from the theme. Existing charts that relied on Chart.js default styling will look different; pass `:themed="false"` to opt out.

### Removed

- **Breaking:** `Chart`'s `generateLegend()` method. It called a Chart.js 2 API that has not existed since Chart.js 3, so it threw whenever it was called. Use the `plugins` option to customise legends.

### Fixed

- `Chart`'s `getCanvas()` returned `undefined` because it read a property that was never assigned.
- `Chart` no longer builds an instance against a detached canvas when the component unmounts before the async `chart.js` import resolves.
- `Chart` now reflects replaced `data` and `options` objects, which previously did not reach the underlying instance.
- The `Password` mask toggle fired twice when a custom slot was used.
- The show/hide and clear buttons on `Password` are now keyboard accessible.

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

[unreleased]: https://github.com/openvi-foundation/openvue/compare/1.0.0-rc.0...HEAD
[1.0.0-rc.0]: https://github.com/openvi-foundation/openvue/compare/0.7.0-beta.0...1.0.0-rc.0
[0.7.0-beta.0]: https://github.com/openvi-foundation/openvue/compare/0.0.1-beta.1...0.7.0-beta.0
[0.0.1-beta.1]: https://github.com/openvi-foundation/openvue/compare/0.0.1-beta.0...0.0.1-beta.1
[0.0.1-beta.0]: https://github.com/openvi-foundation/openvue/compare/0.0.1-alpha.5...0.0.1-beta.0
[0.0.1-alpha.5]: https://github.com/openvi-foundation/openvue/compare/0.0.1-alpha.4...0.0.1-alpha.5
[0.0.1-alpha.4]: https://github.com/openvi-foundation/openvue/compare/0.0.1-alpha.3...0.0.1-alpha.4
[0.0.1-alpha.3]: https://github.com/openvi-foundation/openvue/compare/0.0.1-alpha.2...0.0.1-alpha.3
[0.0.1-alpha.2]: https://github.com/openvi-foundation/openvue/compare/0.0.1-alpha.1...0.0.1-alpha.2
[0.0.1-alpha.1]: https://github.com/openvi-foundation/openvue/releases/tag/0.0.1-alpha.1
