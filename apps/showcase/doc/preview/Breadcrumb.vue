<template>
    <Breadcrumb :home="home" :model="items" class="w-full" />
</template>

<script>
export default {
    data() {
        return {
            home: { icon: 'pi pi-home' },
            items: [{ label: 'Components' }, { label: 'Button' }]
        };
    }
};
</script>
