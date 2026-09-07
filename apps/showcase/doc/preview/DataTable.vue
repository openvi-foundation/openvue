<template>
    <DataTable :value="rows" size="small" class="w-full"><Column field="name" header="Product"></Column><Column field="qty" header="Qty"></Column></DataTable>
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
