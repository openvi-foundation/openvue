<template>
    <DocPlayground :schema="schema" @reset="clear">
        <template #preview="{ props }">
            <Rating v-bind="props" v-model="value" />
        </template>
    </DocPlayground>
</template>

<script>
import DocPlayground from '@/components/doc/playground/DocPlayground.vue';
import schema from './playground/schema';

export default {
    components: {
        DocPlayground
    },
    data() {
        return {
            schema,
            value: 3
        };
    },
    methods: {
        clear() {
            this.value = 3;
        }
    }
};
</script>
