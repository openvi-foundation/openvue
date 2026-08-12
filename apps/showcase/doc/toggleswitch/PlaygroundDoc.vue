<template>
    <DocPlayground :schema="schema" @reset="clear">
        <template #preview="{ props }">
            <ToggleSwitch v-bind="props" v-model="checked" />
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
            checked: false
        };
    },
    methods: {
        clear() {
            this.checked = false;
        }
    }
};
</script>
