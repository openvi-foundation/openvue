<template>
    <DocPlayground :schema="schema" @update:props="onProps" @reset="clear">
        <template #preview="{ props }">
            <SelectButton v-bind="props" v-model="mode" :options="modes" />
        </template>
    </DocPlayground>
</template>

<script>
import DocPlayground from '@/components/doc/playground/DocPlayground.vue';
import schema, { MODES } from './playground/schema';

export default {
    components: {
        DocPlayground
    },
    /*
     * Turning on `multiple` swaps the model between one option and a list of them, so the value is replaced rather than carried across the change.
     */
    data() {
        return {
            schema,
            modes: MODES,
            mode: null,
            multiple: false
        };
    },
    methods: {
        onProps(props) {
            const multiple = props.multiple === true;

            if (multiple === this.multiple) return;

            this.multiple = multiple;
            this.clear();
        },
        clear() {
            this.mode = this.multiple ? [] : null;
        }
    }
};
</script>
