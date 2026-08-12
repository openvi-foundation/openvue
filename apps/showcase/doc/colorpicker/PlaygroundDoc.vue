<template>
    <DocPlayground :schema="schema" @update:props="onProps" @reset="clear">
        <template #preview="{ props }">
            <ColorPicker v-bind="props" v-model="color" />
        </template>
    </DocPlayground>
</template>

<script>
import DocPlayground from '@/components/doc/playground/DocPlayground.vue';
import schema from './playground/schema';

/* the same colour written three ways, one per format the component reads its model in */
const DEFAULT_COLOR = {
    hex: '6466f1',
    rgb: { r: 100, g: 102, b: 241 },
    hsb: { h: 239, s: 59, b: 95 }
};

export default {
    components: {
        DocPlayground
    },
    /*
     * The model is written in the format the `format` property names, so changing it means starting from the default colour again rather than reinterpreting the old value.
     */
    data() {
        return {
            schema,
            color: '6466f1',
            format: 'hex'
        };
    },
    methods: {
        onProps(props) {
            const format = props.format ?? 'hex';

            if (format === this.format) return;

            this.format = format;
            this.color = DEFAULT_COLOR[format];
        },
        clear() {
            this.color = DEFAULT_COLOR[this.format];
        }
    }
};
</script>
