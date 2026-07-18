<template>
    <Button label="Save" @click="save" />
</template>

<script setup>
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

function save() {
    toast.add({ severity: 'success', summary: 'Saved' });
}
</script>
