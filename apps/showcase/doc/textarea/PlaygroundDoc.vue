<template>
    <DocPlayground :schema="schema" @reset="clear">
        <template #preview="{ props }">
            <Textarea v-bind="props" v-model="value" class="w-full max-w-72" />
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
            value: ''
        };
    },
    methods: {
        clear() {
            this.value = '';
        }
    }
};
</script>
