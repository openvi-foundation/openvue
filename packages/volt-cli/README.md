# openvolt-vue

CLI that adds [OpenVolt](https://github.com/openvi-foundation/openvue/tree/master/apps/volt) components to your project. OpenVolt components are OpenVue components in unstyled mode, styled with Tailwind CSS. You copy them into your codebase and own the files from then on.

The component files ship inside this package. `openvolt-vue@1.2.0` always adds the OpenVolt files that match `openvue@1.2.0`, and nothing is downloaded when it runs, so it works offline and needs no git.

OpenVue and OpenVolt are not affiliated with PrimeTek or PrimeUI.

## Usage

Set up OpenVue in unstyled mode, Tailwind CSS 4, `tailwindcss-primeui` and `tailwind-merge` first, as described in the OpenVolt Vite or Nuxt guide. Then, from the root of your project:

```sh
npx openvolt-vue add Button
npx openvolt-vue add DataTable Dialog DatePicker
npx openvolt-vue add all
npx openvolt-vue list
```

Components are written to `src/volt`. Every run also adds `utils.ts`, which all components import. Component names are case-insensitive.

| Option           | Description                                                   |
| ---------------- | ------------------------------------------------------------- |
| `--outdir <dir>` | Copy into `<dir>/volt` instead of `src/volt`                  |
| `--no-src-dir`   | Copy into `./volt` instead of `src/volt`                      |
| `--no-deps`      | Do not copy the OpenVolt components the requested ones import |
| `--overwrite`    | Replace files that already exist                              |
| `--version`      | Print the version                                             |
| `--help`         | Show help                                                     |

## What it does

1. Copies the requested components and `utils.ts`. Components that another OpenVolt component imports come along too, for example `DataTable` brings `SecondaryButton`. Pass `--no-deps` to skip them.
2. Leaves files that already exist untouched, since you may have customized them, and lists them as skipped. Pass `--overwrite` to replace them with the bundled version.
3. Checks your `package.json` for the npm packages the copied files import (`openvue`, `@openvue/icons`, `tailwind-merge`) and prints the install command for any that are missing. It never installs anything itself.

## Coming from PrimeVue Volt

The `volt-vue` CLI fetches PrimeVue's Volt components, which import from `primevue`. Use `npx openvolt-vue` instead to get the OpenVolt versions, which import from `openvue`. The command and options are the same, except that existing files are kept unless you pass `--overwrite`.
