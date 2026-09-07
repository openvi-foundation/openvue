<template>
    <Menu :model="items" class="w-full" />
</template>

<script>
export default {
    data() {
        return {
            items: [
                { label: 'Copy', icon: 'pi pi-copy' },
                { label: 'Delete', icon: 'pi pi-trash' }
            ]
        };
    }
};
</script>
