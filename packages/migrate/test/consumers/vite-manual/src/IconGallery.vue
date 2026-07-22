<template>
    <section aria-label="OpenVue icon surface">
        <component :is="icon.component" v-for="icon in renderableIcons" :key="icon.name" :data-openvue-icon="icon.name" aria-hidden="true" />
    </section>
</template>

<script setup lang="ts">
import * as icons from '@primevue/icons';

const renderableIcons = Object.entries(icons)
    .filter(([name]) => name.endsWith('Icon') && name !== 'BaseIcon')
    .map(([name, component]) => ({ name, component }));
</script>
