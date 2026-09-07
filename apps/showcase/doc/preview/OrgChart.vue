<template>
    <OrganizationChart :value="node" />
</template>

<script>
export default {
    data() {
        return {
            node: {
                key: '0',
                label: 'CEO',
                children: [
                    { key: '0_0', label: 'Sales' },
                    { key: '0_1', label: 'Tech' }
                ]
            }
        };
    }
};
</script>
