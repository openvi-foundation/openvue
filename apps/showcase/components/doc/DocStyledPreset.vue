<template>
    <DocSectionText>
        <p>OpenVue offers various preset options that allow you to customize the component's styling to match your application's design system. Below you'll find links to the implementation and type definitions for each preset.</p>
        <div class="doc-tablewrapper mt-4">
            <table class="doc-preset-table">
                <thead>
                    <tr>
                        <th v-for="header in headers" :key="header">
                            <template v-if="header !== 'readonly' && header !== 'optional' && header !== 'deprecated'">
                                {{ header }}
                            </template>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="preset in presets" :key="preset">
                        <td :class="`doc-option-preset-name-${preset.toLowerCase()}`">{{ preset }}</td>
                        <td :class="`doc-option-preset-implementation-${preset.toLowerCase()}`">
                            <a
                                :href="implementationUrl(preset)"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="inline-flex rounded-full px-3 py-1 bg-surface-200 hover:bg-surface-300 transition-all duration-200 gap-2 items-center text-sm dark:bg-surface-800 dark:hover:bg-surface-700"
                            >
                                <span class="text-surface-900 dark:text-surface-50 font-medium">{{ preset }}</span>
                                <i class="pi pi-external-link !text-xs text-surface-900 dark:text-surface-50"></i>
                            </a>
                        </td>
                        <td :class="`doc-option-preset-type-${preset.toLowerCase()}`">
                            <a
                                :href="typesUrl(preset)"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="inline-flex rounded-full px-3 py-1 bg-surface-200 hover:bg-surface-300 transition-all duration-200 gap-2 items-center text-sm dark:bg-surface-800 dark:hover:bg-surface-700"
                            >
                                <span class="text-surface-900 dark:text-surface-50 font-medium">{{ preset }}</span>
                                <i class="pi pi-external-link !text-xs text-surface-900 dark:text-surface-50"></i>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </DocSectionText>
</template>

<script>
export default {
    data() {
        return {
            headers: ['Preset', 'Implementation', 'Types'],
            presets: ['Aura', 'Lara', 'Nora', 'Material', 'Nide']
        };
    },
    methods: {
        implementationUrl(preset) {
            if (preset === 'Nide') {
                return `https://github.com/openvi-foundation/openvue/blob/master/packages/themes/src/presets/nide/${this.$attrs.data}/index.js`;
            }

            return `https://github.com/primefaces/primeuix/blob/main/packages/themes/src/presets/${preset.toLowerCase()}/${this.$attrs.data}/index.ts`;
        },
        typesUrl(preset) {
            if (preset === 'Nide') {
                return `https://github.com/openvi-foundation/openvue/blob/master/packages/themes/types/${this.$attrs.data}/index.d.ts`;
            }

            return `https://github.com/primefaces/primeuix/blob/main/packages/themes/src/presets/${preset.toLowerCase()}/${this.$attrs.data}/index.d.ts`;
        }
    }
};
</script>
