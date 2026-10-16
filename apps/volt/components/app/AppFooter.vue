<template>
    <div class="layout-footer">
        <div>
            <span>OpenVue {{ version }} by </span>
            <a href="https://openvue.dev/team/" target="_blank" rel="noopener noreferrer">OpenVi Foundation</a>
        </div>
    </div>
</template>

<script setup lang="ts">
import pkg from '@/package.json';
import { ref } from 'vue';

const version = ref(pkg.version);
</script>
