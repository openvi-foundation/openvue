<template>
    <Tree :value="nodes" class="w-full" />
</template>

<script>
export default {
    data() {
        return {
            nodes: [{ key: '0', label: 'Documents', children: [{ key: '0-0', label: 'Invoice.pdf' }] }]
        };
    }
};
</script>
