<template>
    <DocPlayground :schema="schema" @update:props="onProps" @reset="clear">
        <template #preview="{ props }">
            <DatePicker v-bind="props" v-model="date" class="w-full max-w-72" />
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
     * The selection mode decides whether the model is one date, a list of them or a pair, so the value is replaced rather than carried across a change of mode.
     */
    data() {
        return {
            schema,
            date: null,
            mode: 'single'
        };
    },
    methods: {
        onProps(props) {
            const mode = props.selectionMode ?? 'single';

            if (mode === this.mode) return;

            this.mode = mode;
            this.clear();
        },
        clear() {
            this.date = null;
        }
    }
};
</script>
