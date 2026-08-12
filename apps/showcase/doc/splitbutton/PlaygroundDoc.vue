<template>
    <DocPlayground :schema="schema" @reset="clear">
        <template #preview="{ props }">
            <SplitButton v-bind="props" :model="items" />
        </template>
    </DocPlayground>
</template>

<script>
import DocPlayground from '@/components/doc/playground/DocPlayground.vue';
import schema, { ACTIONS } from './playground/schema';

export default {
    components: {
        DocPlayground
    },
    data() {
        return {
            schema,
            items: ACTIONS
        };
    },
    methods: {
        clear() {
            // a SplitButton holds no value of its own, so a reset has nothing to clear
        }
    }
};
</script>
