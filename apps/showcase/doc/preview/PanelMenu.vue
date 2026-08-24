<template>
    <PanelMenu :model="items" class="w-full" />
</template>

<script>
export default {
    data() {
        return {
            items: [
                { label: 'Files', icon: 'pi pi-folder' },
                { label: 'Cloud', icon: 'pi pi-cloud' }
            ]
        };
    }
};
</script>
