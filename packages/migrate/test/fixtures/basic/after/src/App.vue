<template>
    <Button label="Save" @click="save" />
</template>

<script setup>
import Button from 'openvue/button';
import { useToast } from 'openvue/usetoast';

const toast = useToast();

function save() {
    toast.add({ severity: 'success', summary: 'Saved' });
}
</script>
