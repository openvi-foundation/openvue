<template>
    <DocPlayground :schema="schema" @reset="clear">
        <template #preview="{ props }">
            <RadioButton v-bind="props" v-model="picked" value="one" />
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
            picked: 'one'
        };
    },
    methods: {
        clear() {
            this.picked = 'one';
        }
    }
};
</script>
