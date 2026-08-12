<template>
    <DocPlayground :schema="schema" @update:props="onProps" @reset="clear">
        <template #preview="{ props }">
            <Listbox v-bind="props" v-model="selectedCity" :options="cities" optionLabel="name" class="w-full max-w-56" />
        </template>
    </DocPlayground>
</template>

<script>
import DocPlayground from '@/components/doc/playground/DocPlayground.vue';
import schema, { CITIES } from './playground/schema';

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
            cities: CITIES,
            selectedCity: null,
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
            this.selectedCity = this.multiple ? [] : null;
        }
    }
};
</script>
