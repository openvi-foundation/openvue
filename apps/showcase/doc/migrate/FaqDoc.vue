<template>
    <DocSectionText v-bind="$attrs">
        <div class="leading-relaxed">
            <h3 class="font-semibold">Is OpenVue a drop-in replacement for PrimeVue?</h3>
            <p>
                Yes. OpenVue is a fork of PrimeVue 4.5.5 that keeps the public API unchanged: <i>usePrimeVue</i>, <i>PrimeVueResolver</i>, the <i>primevue</i> Nuxt config key, <i>p-</i> prefixed CSS classes and pass-through options all work exactly
                as before. Migrating is a package rename, not a rewrite.
            </p>

            <h3 class="font-semibold mt-6">How do I migrate a PrimeVue project to OpenVue?</h3>
            <p>
                Run <i>@openvue/migrate</i> from the root of your project. It detects your package manager and PrimeVue version, shows you a plan of every file and reference it will change, and only then rewrites imports and dependencies. Monorepos,
                Vite, Nuxt and Laravel projects are supported, and a dry run mode writes nothing.
            </p>

            <h3 class="font-semibold mt-6">What licence is OpenVue released under?</h3>
            <p>
                OpenVue is MIT licensed. PrimeVue 4.5.5 was the last release published under an open source licence, and OpenVue continues that work in the open with bug fixes, accessibility and performance improvements, support for current Vue and
                Nuxt releases, and new components.
            </p>

            <h3 class="font-semibold mt-6">Can I migrate from PrimeVue v3?</h3>
            <p>
                Not directly. The fork point is PrimeVue 4.x, and the tool stops without changing anything if it finds a different major. Apply the <NuxtLink to="/guides/migration/v4" class="doc-link">PrimeVue v4 migration guide</NuxtLink> first,
                then run <i>@openvue/migrate</i>.
            </p>
        </div>
    </DocSectionText>
</template>
