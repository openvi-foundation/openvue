<template>
    <DocSectionText v-bind="$attrs">
        <p>OpenVue starts from the PrimeVue 4.5.5 source, so moving over is a rename rather than a rewrite.</p>
        <div class="doc-tablewrapper">
            <table class="doc-table">
                <thead>
                    <tr>
                        <th>Stays the same</th>
                        <th>Changes</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Component names, props, events and slots</td>
                        <td><i>primevue</i> becomes <i>openvue</i></td>
                    </tr>
                    <tr>
                        <td><i>usePrimeVue</i>, <i>PrimeVueResolver</i> and the <i>primevue</i> Nuxt config key</td>
                        <td><i>@primevue/*</i> packages become <i>@openvue/*</i></td>
                    </tr>
                    <tr>
                        <td><i>p-</i> prefixed CSS classes, pass-through options and unstyled mode</td>
                        <td>PrimeIcons is replaced by <NuxtLink to="/icons" class="doc-link">OpenIcons</NuxtLink>, with a compatibility stylesheet that keeps <i>pi pi-*</i> classes working</td>
                    </tr>
                    <tr>
                        <td>Aura, Lara and Nora theme presets and design tokens</td>
                        <td>Theme presets are imported from <i>@openvue/themes</i></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </DocSectionText>
</template>
