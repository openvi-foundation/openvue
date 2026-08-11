<template>
    <DocPlayground :schema="schema" @update:props="onProps" @reset="clear">
        <template #preview="{ props }">
            <AutoComplete v-bind="props" v-model="value" :suggestions="items" @complete="search" class="w-full max-w-80" />
        </template>
    </DocPlayground>
</template>

<script>
import DocPlayground from '@/components/doc/playground/DocPlayground.vue';
import schema, { COUNTRIES } from './playground/schema';

export default {
    components: {
        DocPlayground
    },
    data() {
        return {
            schema,
            multiple: false,
            value: null,
            items: []
        };
    },
    methods: {
        /*
         * A multiple AutoComplete binds an array of picks and a single one binds the picked value,
         * so the model is swapped when the toggle moves rather than carried across it.
         */
        onProps(props) {
            const multiple = props.multiple === true;

            if (multiple === this.multiple) return;

            this.multiple = multiple;
            this.clear();
        },
        clear() {
            this.value = this.multiple ? [] : null;
            this.items = [];
        },
        search(event) {
            const query = event.query.toLowerCase();

            this.items = COUNTRIES.filter((country) => country.toLowerCase().includes(query));
        }
    }
};
</script>
