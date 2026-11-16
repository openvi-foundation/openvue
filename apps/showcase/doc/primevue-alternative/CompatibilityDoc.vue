<template>
    <DocSectionText v-bind="$attrs">
        <p>OpenVue starts from the PrimeVue 4.5.5 source, so moving over is a rename rather than a rewrite.</p>

        <div class="alt-compare">
            <div class="alt-compare-column">
                <h3 class="alt-compare-title">Stays the same</h3>
                <ul class="alt-checklist">
                    <li><span class="pi pi-check" aria-hidden="true"></span><span>Component names, props, events and slots</span></li>
                    <li>
                        <span class="pi pi-check" aria-hidden="true"></span><span><code>usePrimeVue</code>, <code>PrimeVueResolver</code> and the <code>primevue</code> Nuxt config key</span>
                    </li>
                    <li>
                        <span class="pi pi-check" aria-hidden="true"></span><span><code>p-</code> prefixed CSS classes, pass-through options and unstyled mode</span>
                    </li>
                    <li><span class="pi pi-check" aria-hidden="true"></span><span>Aura, Lara and Nora theme presets and design tokens</span></li>
                </ul>
            </div>
            <div class="alt-compare-column">
                <h3 class="alt-compare-title">Changes</h3>
                <ul class="alt-checklist is-changes">
                    <li>
                        <span class="pi pi-arrow-right" aria-hidden="true"></span><span><code>primevue</code> becomes <code>openvue</code></span>
                    </li>
                    <li>
                        <span class="pi pi-arrow-right" aria-hidden="true"></span><span><code>@primevue/*</code> packages become <code>@openvue/*</code></span>
                    </li>
                    <li>
                        <span class="pi pi-arrow-right" aria-hidden="true"></span
                        ><span
                            >PrimeIcons is replaced by <a href="https://openicons.openvue.dev/" target="_blank" rel="noopener noreferrer" class="doc-link">OpenIcons</a>, with a compatibility stylesheet that keeps <code>pi pi-*</code> classes
                            working</span
                        >
                    </li>
                    <li>
                        <span class="pi pi-arrow-right" aria-hidden="true"></span><span>Theme presets are imported from <code>@openvue/themes</code></span>
                    </li>
                </ul>
            </div>
        </div>
    </DocSectionText>
</template>

<script>
export default {
    inheritAttrs: false
};
</script>
