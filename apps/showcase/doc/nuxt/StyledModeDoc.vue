<template>
    <DocSectionText v-bind="$attrs">
        <p>Styled mode provides pre-skinned components, default theme is Aura with emerald as the primary color. See the <NuxtLink to="/theming/styled">styled mode</NuxtLink> documentation for details.</p>
        <p>Install the <i>@openvue/themes</i> add-on package as the themes are not included in OpenVue by default.</p>
        <DocSectionCode :code="code1" hideToggleCode hideStackBlitz />
        <p>
            Alternatively install <i>@openuxkit/themes</i>, the engine package that <i>@openvue/themes</i> is built on. It provides the same presets and utilities, so the configuration below works with either by changing only the import path. See
            <NuxtLink to="/theming/styled/#packages">theme packages</NuxtLink> for details.
        </p>
        <DocSectionCode :code="code1Alt" hideToggleCode hideStackBlitz />
        <p>Configure the module to use a theme like Aura.</p>
        <DocSectionCode :code="code2" importCode hideToggleCode hideStackBlitz />
    </DocSectionText>
</template>

<script>
export default {
    data() {
        return {
            code1: {
                basic: `
# Using npm
npm install @openvue/themes

# Using yarn
yarn add @openvue/themes

# Using pnpm
pnpm add @openvue/themes
`
            },
            code1Alt: {
                basic: `
# Using npm
npm install @openuxkit/themes

# Using yarn
yarn add @openuxkit/themes

# Using pnpm
pnpm add @openuxkit/themes
`
            },
            code2: {
                basic: `
import Aura from '@openvue/themes/aura';

export default defineNuxtConfig({
    modules: [
        '@openvue/nuxt-module'
    ],
    primevue: {
        options: {
            theme: {
                preset: Aura
            }
        }
    }
})
`
            }
        };
    }
};
</script>
