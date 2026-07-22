<template>
    <main data-testid="ready" class="grid gap-6 p-8">
        <h1 class="text-2xl font-semibold">Volt migration contract</h1>
        <Toast />
        <ConfirmDialog />
        <div class="flex gap-3">
            <Button data-testid="show-toast" label="Volt toast" @click="showToast" />
            <SecondaryButton data-testid="show-confirm" label="Volt confirm" @click="showConfirm" />
        </div>
        <Panel header="Tailwind panel"><InputText v-model="value" /></Panel>
        <DataTable :value="rows"><Column field="name" header="Name" /></DataTable>
        <p data-testid="volt-wrapper-count">Bundled Volt wrappers: {{ voltWrapperCount }}</p>
    </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Column from 'primevue/column';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import Button from './volt/Button.vue';
import ConfirmDialog from './volt/ConfirmDialog.vue';
import DataTable from './volt/DataTable.vue';
import InputText from './volt/InputText.vue';
import Panel from './volt/Panel.vue';
import SecondaryButton from './volt/SecondaryButton.vue';
import Toast from './volt/Toast.vue';
import { voltWrapperCount } from './surface';

const value = ref('Volt');
const rows = [{ name: 'Unstyled' }, { name: 'Tailwind' }];
const toast = useToast();
const confirm = useConfirm();

function showToast() {
    toast.add({ severity: 'success', summary: 'Volt', detail: 'Tailwind wrapper works', life: 2000 });
}

function showConfirm() {
    confirm.require({ message: 'Volt confirmation', header: 'Unstyled service' });
}
</script>
