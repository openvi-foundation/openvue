<template>
    <DocPlayground :schema="schema">
        <template #preview="{ props, child }">
            <!-- keyed on the shape of the markup: Splitter measures its panels once, when they are created -->
            <Splitter :key="`${child.panels}-${child.size}-${child.minSize}`" v-bind="props" class="w-full md:w-[36rem] h-72">
                <SplitterPanel v-for="index in child.panels" :key="index" :size="index === 1 ? child.size : undefined" :minSize="index === 1 ? child.minSize : undefined" class="flex items-center justify-center">Panel {{ index }}</SplitterPanel>
            </Splitter>
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
    }
};
</script>
