<template>
    <main data-testid="ready">
        <h1>Laravel and Vite</h1>
        <Toast />
        <Button v-tooltip.top="'Laravel directive'" data-testid="show-toast" label="Laravel toast" @click="showToast" />
        <Card
            ><template #title>Blade mounted Vue</template><template #content><InputText v-model="value" /></template
        ></Card>
    </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const value = ref('Laravel');
const toast = useToast();

function showToast() {
    toast.add({ severity: 'success', summary: 'Laravel', detail: 'Blade and Vite work', life: 2000 });
}
</script>
