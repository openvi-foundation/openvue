<template>
    <TieredMenu :model="items" class="w-full" />
</template>

<script>
export default {
    data() {
        return {
            items: [{ label: 'File', items: [{ label: 'New' }] }, { label: 'Edit' }]
        };
    }
};
</script>
