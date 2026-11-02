<template>
    <DocSectionText v-bind="$attrs">
        <p>Lazy loading is useful when dealing with huge datasets, in this example nodes are dynamically loaded on demand using <i>loading</i> property and <i>node-expand</i> method.</p>
    </DocSectionText>
    <div class="card">
        <Tree :value="nodes" @node-expand="onNodeExpand" loadingMode="icon" class="w-full md:w-[30rem]"></Tree>
    </div>
    <DocSectionCode :code="code" />
</template>

<script setup lang="ts">
import Tree from '@/volt/Tree.vue';
import { ref } from 'vue';

const nodes = ref([
    {
        key: '0',
        label: 'Node 0',
        leaf: false
    },
    {
        key: '1',
        label: 'Node 1',
        leaf: false
    },
    {
        key: '2',
        label: 'Node 2',
        leaf: false
    }
]);

const onNodeExpand = (node) => {
    if (!node.children) {
        node.loading = true;

        setTimeout(() => {
            node.children = [];

            for (let i = 0; i < 3; i++) {
                node.children.push({
                    key: node.key + '-' + i,
                    label: 'Lazy ' + node.label + '-' + i
                });
            }

            node.loading = false;
        }, 500);
    }
};

const code = ref(`
<template>
    <div class="card">
        <Tree :value="nodes" @node-expand="onNodeExpand" loadingMode="icon" class="w-full md:w-[30rem]"></Tree>
    </div>
</template>

<script setup lang="ts">
import Tree from '@/volt/Tree.vue';
import { ref } from 'vue';

const nodes = ref([
    {
        key: '0',
        label: 'Node 0',
        leaf: false
    },
    {
        key: '1',
        label: 'Node 1',
        leaf: false
    },
    {
        key: '2',
        label: 'Node 2',
        leaf: false
    }
]);

const onNodeExpand = (node) => {
    if (!node.children) {
        node.loading = true;

        setTimeout(() => {
            node.children = [];

            for (let i = 0; i < 3; i++) {
                node.children.push({
                    key: node.key + '-' + i,
                    label: 'Lazy ' + node.label + '-' + i
                });
            }

            node.loading = false;
        }, 500);
    }
};
<\/script>
`);
</script>
