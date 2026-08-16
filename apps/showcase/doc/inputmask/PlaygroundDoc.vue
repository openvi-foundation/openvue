<template>
    <DocPlayground :schema="schema" @reset="clear">
        <template #preview="{ props }">
            <InputMask v-bind="props" v-model="value" mask="99-999999" class="w-full max-w-72" />
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
            value: null
        };
    },
    methods: {
        clear() {
            this.value = null;
        }
    }
};
</script>
