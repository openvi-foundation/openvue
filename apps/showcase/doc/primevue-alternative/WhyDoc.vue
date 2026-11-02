<template>
    <!-- Kept as static markup rather than v-for so scripts/build-llm-docs.mjs, which parses templates, sees the text. -->
    <DocSectionText v-bind="$attrs">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="border border-surface rounded-border p-4">
                <i class="pi pi-code text-primary text-xl" />
                <h4 class="mt-3 mb-2 text-lg font-semibold">Nothing to rewrite</h4>
                <p class="m-0 text-base leading-normal text-surface-600 dark:text-surface-300">Same components, props, events, slots, pass-through and themes as PrimeVue 4.5.5. Switching is a package rename that one command does for you.</p>
            </div>
            <div class="border border-surface rounded-border p-4">
                <i class="pi pi-unlock text-primary text-xl" />
                <h4 class="mt-3 mb-2 text-lg font-semibold">MIT, no license fees</h4>
                <p class="m-0 text-base leading-normal text-surface-600 dark:text-surface-300">No per-developer pricing, no revenue limits, no license keys. Every package is MIT, and a license change elsewhere cannot reach code you already have.</p>
            </div>
            <div class="border border-surface rounded-border p-4">
                <i class="pi pi-sync text-primary text-xl" />
                <h4 class="mt-3 mb-2 text-lg font-semibold">Still moving forward</h4>
                <p class="m-0 text-base leading-normal text-surface-600 dark:text-surface-300">Ten releases since July 2026, a stable 1.0 in September, and fixes and features landing every few weeks from a growing group of contributors.</p>
            </div>
        </div>
    </DocSectionText>
</template>
