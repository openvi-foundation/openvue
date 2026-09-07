<template>
    <DocSectionText v-bind="$attrs">
        <p>OpenVue is available for download on <a href="https://www.npmjs.com/package/openvue" target="_blank" rel="noopener noreferrer">npm registry</a>.</p>
        <DocSectionCode :code="code1" lang="bash" />
        <p>Configure OpenVue to enable the unstyled mode that disables the default design token based theming globally.</p>
        <DocSectionCode :code="code2" lang="script" />
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

const code2 = ref(`import { createApp } from 'vue';
import OpenVue from 'openvue/config';

const app = createApp(App);
app.use(OpenVue, {
    unstyled: true
});
`);
</script>
