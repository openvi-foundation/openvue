<template>
    <DocPlayground :schema="schema" @reset="clear">
        <template #preview="{ props }">
            <Select v-bind="props" v-model="selectedCity" :options="cities" optionLabel="name" class="w-full max-w-56" />
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
     * Select's model is a single option however the properties are set, so unlike AutoComplete there
     * is no `update:props` to listen to: nothing in the rail changes the shape of what is bound.
     */
    data() {
        return {
            schema,
            cities: CITIES,
            selectedCity: null
        };
    },
    methods: {
        clear() {
            this.selectedCity = null;
        }
    }
};
</script>
