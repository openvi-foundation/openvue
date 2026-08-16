<template>
    <DocPlayground :schema="schema">
        <template #preview="{ props, child }">
            <ScrollPanel v-bind="props" class="w-full md:w-[36rem]" style="height: 200px">
                <p v-for="(paragraph, index) in paragraphs(child)" :key="index">{{ paragraph }}</p>
            </ScrollPanel>
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
            schema
        };
    },
    methods: {
        paragraphs(child) {
            return Array.from({ length: child.paragraphs }, (_, index) => PROSE[index % PROSE.length]);
        }
    }
};
</script>
