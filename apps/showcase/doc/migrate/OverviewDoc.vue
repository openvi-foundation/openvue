<template>
    <DocSectionText v-bind="$attrs">
        <p>
            OpenVue is a fork of PrimeVue v4 that keeps the public API unchanged: <i>usePrimeVue</i>, <i>PrimeVueResolver</i>, the <i>primevue</i> Nuxt config key, <i>p-</i> prefixed CSS classes and pass-through options all work exactly as before.
            Migrating is therefore a package rename, which is exactly and only what
            <a href="https://www.npmjs.com/package/@openvue/migrate" target="_blank" rel="noopener noreferrer">@openvue/migrate</a> does: an automated codemod that rewrites your project's imports and package references from PrimeVue to OpenVue.
        </p>
        <p>The tool is ready to use. It handles Vite, Nuxt and Laravel projects, monorepos included, and always shows you what it will change before touching a single file.</p>
    </DocSectionText>
</template>
