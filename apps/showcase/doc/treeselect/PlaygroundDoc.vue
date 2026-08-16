<template>
    <DocPlayground :schema="schema" @reset="clear">
        <template #preview="{ props }">
            <TreeSelect v-bind="props" v-model="selectedNode" :options="nodes" class="w-full max-w-72" />
        </template>
    </DocPlayground>
</template>

<script>
import DocPlayground from '@/components/doc/playground/DocPlayground.vue';
import schema, { NODES } from './playground/schema';

export default {
    components: {
        DocPlayground
    },
    data() {
        return {
            schema,
            nodes: NODES,
            selectedNode: null
        };
    },
    methods: {
        clear() {
            this.selectedNode = null;
        }
    }
};
</script>
