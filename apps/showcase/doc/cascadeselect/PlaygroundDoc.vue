<template>
    <DocPlayground :schema="schema" @reset="clear">
        <template #preview="{ props }">
            <CascadeSelect v-bind="props" v-model="selectedCity" :options="regions" optionLabel="cname" optionGroupLabel="name" :optionGroupChildren="['countries', 'cities']" class="w-full max-w-72" />
        </template>
    </DocPlayground>
</template>

<script>
import DocPlayground from '@/components/doc/playground/DocPlayground.vue';
import schema, { REGIONS } from './playground/schema';

export default {
    components: {
        DocPlayground
    },
    data() {
        return {
            schema,
            regions: REGIONS,
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
