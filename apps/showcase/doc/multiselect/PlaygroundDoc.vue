<template>
    <DocPlayground :schema="schema" @reset="clear">
        <template #preview="{ props }">
            <MultiSelect v-bind="props" v-model="selectedCities" :options="cities" optionLabel="name" class="w-full max-w-72" />
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
    data() {
        return {
            schema,
            cities: CITIES,
            selectedCities: []
        };
    },
    methods: {
        clear() {
            this.selectedCities = [];
        }
    }
};
</script>
