<template>
    <main data-testid="ready">
        <h1>{{ pageName }} Inertia migration contract</h1>
        <Toast />
        <ConfirmDialog />
        <Button data-testid="show-toast" label="Inertia toast" @click="showToast" />
        <Button data-testid="show-confirm" label="Inertia confirm" severity="secondary" @click="showConfirm" />
        <Link href="/second">Navigate with Inertia</Link>
    </main>
</template>

<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

withDefaults(defineProps<{ pageName?: string }>(), { pageName: 'Home' });
const toast = useToast();
const confirm = useConfirm();

function showToast() {
    toast.add({ severity: 'success', summary: 'Inertia', detail: 'Client service works', life: 2000 });
}

function showConfirm() {
    confirm.require({ message: 'Inertia confirmation', header: 'Laravel service' });
}
</script>
