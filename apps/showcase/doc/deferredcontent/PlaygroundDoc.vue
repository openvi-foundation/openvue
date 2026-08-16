<template>
    <DocPlayground :schema="schema" @update:child="reload" @reset="reload">
        <template #preview="{ props, child }">
            <div class="w-full md:w-[36rem]">
                <p class="mb-2 text-sm text-surface-500">{{ loaded ? 'The content below has loaded.' : 'Scroll to the bottom of the box to load the content.' }}</p>

                <!-- keyed on the filler, so changing it starts the demonstration over rather than leaving it already loaded -->
                <div :key="child.spacer" class="h-64 overflow-auto border border-surface-200 dark:border-surface-700 rounded p-4">
                    <p v-for="(paragraph, index) in filler(child)" :key="index">{{ paragraph }}</p>

                    <DeferredContent v-bind="props" @load="loaded = true">
                        <p class="m-0">{{ prose }}</p>
                    </DeferredContent>
                </div>
            </div>
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
            prose: PROSE[0],
            loaded: false
        };
    },
    methods: {
        filler(child) {
            return Array.from({ length: child.spacer }, (_, index) => PROSE[index % PROSE.length]);
        },
        reload() {
            this.loaded = false;
        }
    }
};
</script>
