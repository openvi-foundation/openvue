<template>
    <main data-testid="ready">
        <h1>Auto-import migration contract</h1>
        <Toast />
        <Button v-ripple v-tooltip.top="'Resolved directive'" data-testid="show-toast" label="Auto-import toast" @click="showToast" />
        <InputText v-model="query" v-keyfilter.alphanum placeholder="Filter" />
        <DataTable :value="rows" :global-filter="query"><Column field="name" header="Name" /></DataTable>
    </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

const query = ref('');
const rows = [{ name: 'Resolver' }, { name: 'Directive' }];
const toast = useToast();

function showToast() {
    toast.add({ severity: 'success', summary: 'Auto import', detail: 'Components and directives resolved', life: 2000 });
}
</script>
