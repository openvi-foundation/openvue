<template>
    <Menu :model="items" class="w-full" />
</template>

<script>
export default {
    data() {
        return {
            items: [
                { label: 'New', icon: 'pi pi-plus' },
                { label: 'Search', icon: 'pi pi-search' }
            ]
        };
    }
};
</script>
