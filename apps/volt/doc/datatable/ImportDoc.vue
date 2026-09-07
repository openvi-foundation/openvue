<template>
    <DocSectionText v-bind="$attrs" />
    <DocSectionCode :code="code" lang="script" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const code = ref(`import DataTable from '@/volt/DataTable.vue';
import Column from 'openvue/column';
import ColumnGroup from 'openvue/columngroup';  // optional
import Row from 'openvue/row';          // optional
`);
</script>
