# Changelog

All notable changes to OpenVue are documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

OpenVue forked from PrimeVue at 4.5.5. Pre-fork history is in [CHANGELOG_PRIMEVUE.md](CHANGELOG_PRIMEVUE.md) and [CHANGELOG_ARCHIVE.md](CHANGELOG_ARCHIVE.md).

All packages in this repository are released together under a single version.

## [Unreleased]

## [1.0.0] - 2026-09-10

The first stable release. The public API is what OpenVue commits to for the 1.x line, and the packages now publish under the `latest` dist-tag, so a plain `npm install openvue` gives you 1.0.0 instead of a prerelease. From here the project follows semantic versioning: additions go in minor releases, fixes in patch releases, and anything that breaks your code waits for 2.0.

### Added

- `TreeTable` gains the filtering modes `DataTable` already had. A new `filterDisplay` prop turns on either a filter row under the header (`"row"`) or a filter menu with advanced multi-constraint rules (`"menu"`), and `globalFilterFields`, `filterInputProps` and `filterButtonProps` come with it. The filter styles and their design tokens ship in every preset, so Aura, Lara, Material and Nora all style the new filter UI. ([#638](https://github.com/openvi-foundation/openvue/issues/638))
- The Theme Designer, a visual editor for the theming API, is now part of the showcase. Pick a preset as a foundation, edit primitive, semantic and per-component tokens, watch the documentation site restyle as you type, then export the result as an ordinary preset file. It is MIT licensed like the rest of OpenVue, with no account, no license key, no theme limit and no paid tier. It makes no network requests: themes are kept in your browser's local storage and every export, share link and migration is computed on your machine. Open it from the sliders icon in the top bar. ([#655](https://github.com/openvi-foundation/openvue/pull/655))
- Showcase: a components gallery, reachable from the landing page and the footer, with a live preview on every card.
- Showcase: an application template, Deni.
- The contributors who have helped build OpenVue are now credited in the README and kept up to date automatically.

### Changed

- `@openvue/migrate` no longer adds an automatic `primevue` -> `openvue` dependency override. It is not needed for a normal migration; add one yourself if a leftover package still requires `primevue`. ([#639](https://github.com/openvi-foundation/openvue/issues/639))
- The `@openuxkit/styles` and `@openuxkit/themes` engine packages are upgraded to 1.1.0, which is where the TreeTable filter styles and the two `Toast` and `Image` fixes below come from.
- Showcase: a reworked navigation bar and landing hero, the full footer on every page, and fuller SEO metadata across the site.
- Volt: `AccordionHeader` imported its two chevron icons under each other's names, which cancelled out against a matching swap in the template. Both are corrected, so the code now says what it does. Rendering is unchanged. Contributed by [@wahpiangle](https://github.com/wahpiangle). ([#650](https://github.com/openvi-foundation/openvue/pull/650))

### Fixed

- `DataTable` keeps a resized column width attached to its own column when columns are hidden or shown. Widths were stored positionally, so hiding a column shifted every width after it onto the wrong column. Widths are now tracked per column, remapped as the visible set changes, and persisted that way, so a reload no longer pairs a stored width with the wrong column. A column is tracked when it has a `columnKey` or a `field` that is unique among the visible columns; grouped headers and columns that share a field keep the previous positional behaviour, and state written by earlier versions is still restored. Contributed by [@pupuking723](https://github.com/pupuking723). ([#627](https://github.com/openvi-foundation/openvue/pull/627))
- `TreeTable` no longer sorts a column when you click that column's filter menu button. The button sits inside the sortable header, so opening a filter menu also reordered the rows underneath it.
- `ContextMenu`, `MegaMenu`, `Menubar` and `TieredMenu` no longer set `aria-level` on their items. The attribute is not valid on the `menuitem` role and made screen readers announce a nesting depth that is not part of the menu pattern. ([#645](https://github.com/openvi-foundation/openvue/pull/645))
- `Toast` no longer nudges the messages under it in the last frame of a dismissal. A leaving message collapsed its height and margin but held on to its border width, so the rest of the stack shifted by a couple of pixels as it vanished, and the animation did not keep its final frame. The border now collapses with everything else and the animation holds where it ends.
- `Toast` and `Image` apply their backdrop blur in Safari and other WebKit browsers, which still need the `-webkit-backdrop-filter` prefix. The surface behind a toast and the toolbar over an image preview were rendering unblurred there.
- Showcase: dates in the landing page tables render identically in every timezone, instead of shifting by a day depending on where you are.
- Showcase: the homepage stays indexable when the client render fails, so a transient error no longer costs the page its search listing.
- Showcase: the error page and several landing sections no longer overflow horizontally on narrow viewports.

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

[unreleased]: https://github.com/openvi-foundation/openvue/compare/1.0.0...HEAD
[1.0.0]: https://github.com/openvi-foundation/openvue/compare/1.0.0-rc.0...1.0.0
[1.0.0-rc.0]: https://github.com/openvi-foundation/openvue/compare/0.7.0-beta.0...1.0.0-rc.0
[0.7.0-beta.0]: https://github.com/openvi-foundation/openvue/compare/0.0.1-beta.1...0.7.0-beta.0
[0.0.1-beta.1]: https://github.com/openvi-foundation/openvue/compare/0.0.1-beta.0...0.0.1-beta.1
[0.0.1-beta.0]: https://github.com/openvi-foundation/openvue/compare/0.0.1-alpha.5...0.0.1-beta.0
[0.0.1-alpha.5]: https://github.com/openvi-foundation/openvue/compare/0.0.1-alpha.4...0.0.1-alpha.5
[0.0.1-alpha.4]: https://github.com/openvi-foundation/openvue/compare/0.0.1-alpha.3...0.0.1-alpha.4
[0.0.1-alpha.3]: https://github.com/openvi-foundation/openvue/compare/0.0.1-alpha.2...0.0.1-alpha.3
[0.0.1-alpha.2]: https://github.com/openvi-foundation/openvue/compare/0.0.1-alpha.1...0.0.1-alpha.2
[0.0.1-alpha.1]: https://github.com/openvi-foundation/openvue/releases/tag/0.0.1-alpha.1
