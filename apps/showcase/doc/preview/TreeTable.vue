<template>
    <TreeTable :value="nodes" size="small" class="w-full"><Column field="name" header="Name" expander></Column></TreeTable>
</template>

<script>
export default {
    data() {
        return {
            nodes: [{ key: '0', data: { name: 'Documents' }, children: [{ key: '0-0', data: { name: 'Invoice.pdf' } }] }]
        };
    }
};
</script>
