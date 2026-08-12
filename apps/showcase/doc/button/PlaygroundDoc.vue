<template>
    <DocPlayground :schema="schema" @reset="clear">
        <template #preview="{ props }">
            <Button v-bind="props" />
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
            schema
        };
    },
    methods: {
        clear() {
            // a Button holds no value of its own, so a reset has nothing to clear
        }
    }
};
</script>
