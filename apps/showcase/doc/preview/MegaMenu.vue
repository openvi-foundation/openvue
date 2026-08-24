<template>
    <MegaMenu :model="items" class="w-full" />
</template>

<script>
export default {
    data() {
        return {
            items: [{ label: 'Products' }, { label: 'Company' }]
        };
    }
};
</script>
