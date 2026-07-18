<template>
    <DocSectionText v-bind="$attrs">
        <p>Main configuration settings of OpenVue, refer to the <OpenVueNuxtLink to="/configuration">configuration</OpenVueNuxtLink> documentation for details.</p>
    </DocSectionText>
    <DocSectionCode :code="code" importCode hideToggleCode hideStackBlitz />
</template>

<script>
export default {
    data() {
        return {
            code: {
                basic: `
import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
    modules: [
        '@openvue/nuxt-module'
    ],
    primevue: {
        options: {
            ripple: true,
            inputVariant: 'filled',
            theme: {
                preset: Aura,
                options: {
                    prefix: 'p',
                    darkModeSelector: 'system',
                    cssLayer: false
                }
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
