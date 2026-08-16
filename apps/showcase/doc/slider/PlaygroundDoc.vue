<template>
    <DocPlayground :schema="schema" @update:props="onProps" @reset="clear">
        <template #preview="{ props }">
            <Slider v-bind="props" v-model="value" class="w-56" />
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
    /*
     * Turning on `range` swaps the model between one number and a pair of them, so the value is replaced rather than carried across the change.
     */
    data() {
        return {
            schema,
            value: 50,
            range: false
        };
    },
    methods: {
        onProps(props) {
            const range = props.range === true;

            if (range === this.range) return;

            this.range = range;
            this.clear();
        },
        clear() {
            this.value = this.range ? [20, 80] : 50;
        }
    }
};
</script>
