<template>
    <Menubar :model="items" class="w-full" />
</template>

<script>
export default {
    data() {
        return {
            items: [{ label: 'File' }, { label: 'Help' }]
        };
    }
};
</script>
