<template>
    <main data-testid="ready">
        <h1>Nuxt migration contract</h1>
        <Toast />
        <ConfirmDialog />
        <Button v-ripple v-tooltip.top="'Nuxt directive'" data-testid="show-toast" label="Nuxt toast" @click="showToast" />
        <Button data-testid="show-confirm" label="Nuxt confirm" severity="secondary" @click="showConfirm" />
        <Panel header="SSR panel"><InputText v-model="value" /></Panel>
        <DataTable :value="rows"><Column field="name" header="Name" /></DataTable>
    </main>
</template>

<script setup lang="ts">
const value = ref('hydrated');
const rows = [{ name: 'SSR' }, { name: 'Hydration' }];
const toast = useToast();
const confirm = useConfirm();
const primevue = usePrimeVue();

void primevue;

function showToast() {
    toast.add({ severity: 'success', summary: 'Nuxt', detail: 'Hydrated toast', life: 2000 });
}

function showConfirm() {
    confirm.require({ message: 'Nuxt confirmation', header: 'SSR service' });
}
</script>
