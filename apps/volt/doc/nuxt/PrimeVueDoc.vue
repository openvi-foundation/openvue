<template>
    <DocSectionText v-bind="$attrs">
        <p>OpenVue is available for download on <a href="https://www.npmjs.com/package/openvue" target="_blank" rel="noopener noreferrer">npm registry</a>.</p>
        <DocSectionCode :code="code1" lang="bash" />
        <p>Volt does not need the OpenVue Nuxt Module, instead create a openvue.js file inside plugins folder. Using the plugin configure OpenVue to enable the unstyled mode that disables the default design token based theming globally.</p>
        <DocSectionCode :code="code2" lang="script" />
        <p>The nuxt plugin can also be used to configure additional OpenVue features like Toast and Confirmation Services as well as directives.</p>
        <DocSectionCode :code="code3" lang="script" />
    </DocSectionText>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const code1 = ref(`
# Using npm
npm install openvue@rc @openvue/themes

# Using yarn
yarn add openvue@rc @openvue/themes

# Using pnpm
pnpm add openvue@rc @openvue/themes
`);

const code2 = ref(`import OpenVue from 'openvue/config';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(OpenVue, {
        unstyled: true
    });
});
`);

const code3 = ref(`import OpenVue from 'openvue/config';
import AnimateOnScroll from 'openvue/animateonscroll';
import ConfirmationService from 'openvue/confirmationservice';
import StyleClass from 'openvue/styleclass';
import ToastService from 'openvue/toastservice';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(OpenVue, {
        unstyled: true
    });

    // Optional features
    nuxtApp.vueApp.directive('styleclass', StyleClass);
    nuxtApp.vueApp.directive('animateonscroll', AnimateOnScroll);
    nuxtApp.vueApp.use(ToastService);
    nuxtApp.vueApp.use(ConfirmationService);
});
`);
</script>
