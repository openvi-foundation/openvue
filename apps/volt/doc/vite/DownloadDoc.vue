<template>
    <DocSectionText v-bind="$attrs">
        <p>
            Download the OpenVolt components to your application codebase on demand with the <a href="https://www.npmjs.com/package/openvolt-vue" target="_blank" rel="noopener noreferrer">npx openvolt-vue</a> command. Refer to the individual documentation
            pages of the components to access the download command per component.
        </p>
    </DocSectionText>
    <DocSectionCode :code="code" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const code = ref(`
npx openvolt-vue add Button
npx openvolt-vue add DataTable
npx openvolt-vue add Dialog
npx openvolt-vue add DatePicker
`);
</script>
