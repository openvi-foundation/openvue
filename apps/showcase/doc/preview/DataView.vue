<template>
    <DataView :value="rows" class="w-full"
        ><template #list="slotProps"
            ><div v-for="item in slotProps.items" :key="item.name" class="p-3 text-sm">{{ item.name }}</div></template
        ></DataView
    >
</template>

<script>
export default {
    data() {
        return {
            rows: [
                { name: 'Anvil', qty: 12 },
                { name: 'Rope', qty: 3 }
            ]
        };
    }
};
</script>
