# PrimeVue Alternative

PrimeVue 5 ships under a commercial license, and PrimeVue 4 now gets security fixes only. OpenVue keeps the PrimeVue 4 line alive with the same components and API, MIT licensed and actively maintained. Your code stays as it is.

## What Changes

OpenVue starts from the PrimeVue 4.5.5 source, so moving over is a rename rather than a rewrite. Stays the same Changes Component names, props, events and slots primevue becomes openvue usePrimeVue , PrimeVueResolver and the primevue Nuxt config key @primevue/* packages become @openvue/* p- prefixed CSS classes, pass-through options and unstyled mode PrimeIcons is replaced by OpenIcons , with a compatibility stylesheet that keeps pi pi-* classes working Aura, Lara and Nora theme presets and design tokens Theme presets are imported from @openvue/themes

## Will OpenVue Last?

It's the right question to ask about any fork. Here is what protects you. Run by people who depend on it. OpenVue is maintained by the Openvi Foundation , developers who run this library in production themselves, together with outside contributors whose fixes are credited in every release. The whole stack is open. The theming engine and the icon set are maintained alongside the components, and OpenVue has no runtime dependency on any PrimeTek package. Your worst case is fine. Everything is MIT. Whatever happens, the version you install keeps working, and anyone can pick the code up and continue it, the same way OpenVue continued PrimeVue 4. Everything happens in public. Issues, pull requests and decisions are on GitHub , so you can judge the project's health yourself at any time.

## Trademark Notice

PrimeVue, PrimeUI and PrimeTek are trademarks of their respective owner. OpenVue is an independent community fork and is not affiliated with, sponsored by or endorsed by PrimeTek. The names are used only to identify the software that OpenVue is forked from and compared with. Facts on this page come from PrimeTek's public announcements and the npm registry. Tell us through GitHub issues if anything is out of date.

## Compare Your Options

If you run PrimeVue 4 today, you have three realistic paths. Stay on PrimeVue 4.5.5 Upgrade to PrimeVue 5 Switch to OpenVue License MIT PrimeUI license MIT Cost Free Paid per developer, free Community tier for eligible small organizations Free Updates Security fixes only Active, by PrimeTek Active, by the community Effort None A major version upgrade One command PrimeVue 5 is a good fit if you want vendor support and the PrimeUI license works for your organization. Check primeui.dev for current terms. Staying on 4.5.5 works for apps that are finished, but bugs you hit there will stay unfixed. OpenVue is for teams that want to keep their code, keep MIT and keep getting fixes.

## Shipped Since the Fork

A fork is only worth switching to if it keeps shipping. Here are a few highlights from the changelog . Theme Designer, free. Edit every design token visually, watch the docs restyle as you type, and export a preset. No account, no license key, runs entirely in your browser. #655 TreeTable filtering. The filter row and multi-rule filter menu that DataTable already had, styled in all four presets. #638 Variable-height virtual scrolling. VirtualScroller accepts a getItemSize callback, so lists with rows of different heights can be virtualized, and DataTable row groups now work with virtual scrolling. #621 DataTable column widths that stick. Resized widths stay with the right column when columns are hidden or shown, and after a reload. #627 InputNumber typing fixes. Typing after a leading 0 no longer clears the field or shifts currency values. #665 Accessibility fixes. Menu components no longer announce a bogus nesting level to screen readers. #645 AI-ready docs. An MCP server and llms.txt give coding assistants accurate props, events and slots for every component. You can see the result live in the Theme Designer and in Deni , a full application template built on OpenVue.

## Try It Without Risk

You don't have to commit to anything to find out whether OpenVue works for your app. Test it with zero code changes. Add a package override so your existing primevue imports resolve to OpenVue, run your app and your tests. Delete the override to go back. Preview the migration. npx @openvue/migrate --dry lists every file and dependency it would change, and writes nothing. Migrate for real. npx @openvue/migrate asks before writing, and the result is one git diff you can review and revert like any other change.

```vue
// 1. try OpenVue without touching your code (package.json, npm and bun)
{
    "overrides": {
        "primevue": "npm:openvue@1.0.0"
    }
}

// 2. preview what the migration changes
npx @openvue/migrate --dry

// 3. migrate
npx @openvue/migrate
```

## Why Teams Switch

Nothing to rewrite Same components, props, events, slots, pass-through and themes as PrimeVue 4.5.5. Switching is a package rename that one command does for you. MIT, no license fees No per-developer pricing, no revenue limits, no license keys. Every package is MIT, and a license change elsewhere cannot reach code you already have. Still moving forward Ten releases since July 2026, a stable 1.0 in September, and fixes and features landing every few weeks from a growing group of contributors.

## FAQ

Is OpenVue a drop-in replacement for PrimeVue 4? Yes. OpenVue is a fork of PrimeVue 4.5.5 with the same components and public API. Switching renames packages and imports, and @openvue/migrate does that for you in one command. Is OpenVue free for commercial use? Yes. OpenVue is MIT licensed, with no paid tier, no per-developer fee and no revenue limits. Does OpenVue work with Nuxt and Tailwind CSS? Yes. The Nuxt module auto-imports components and works with SSR, and OpenVue integrates with Tailwind CSS in both styled and unstyled modes. Can I migrate a PrimeVue 5 project? The migration tool supports PrimeVue 4.x projects only, since 4.5.5 is the fork point. Projects on version 5 need to be checked by hand. Who maintains OpenVue? The Openvi Foundation , an independent group of developers who use the library in production, together with outside contributors. OpenVue is not affiliated with PrimeTek.

