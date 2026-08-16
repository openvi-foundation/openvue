<template>
    <DocPlayground :schema="schema">
        <template #preview="{ props }">
            <Panel v-bind="props" class="w-full md:w-[36rem]">
                <p class="m-0">{{ prose }}</p>
            </Panel>
        </template>
    </DocPlayground>
</template>

<script>
import { PROSE } from '@/components/doc/playground/fixtures';
import DocPlayground from '@/components/doc/playground/DocPlayground.vue';
import schema from './playground/schema';

export default {
    components: {
        DocPlayground
    },
    data() {
        return {
            schema,
            prose: PROSE[0]
        };
    }
};
</script>
