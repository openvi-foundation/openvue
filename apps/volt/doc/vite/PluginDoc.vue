<template>
    <DocSectionText v-bind="$attrs"> </DocSectionText>
    <DocSectionCode :code="code" lang="script" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const code = ref(`
import { createApp } from 'vue';
import OpenVue from 'openvue/config';

const app = createApp(App);
app.use(OpenVue, {
    unstyled: true
});
`);
</script>
