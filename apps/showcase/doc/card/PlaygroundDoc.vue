<template>
    <DocPlayground :schema="schema">
        <template #preview="{ props, child }">
            <Card v-bind="props" class="w-full md:w-96">
                <!-- the slots are conditional rather than their contents: Card draws a section for any slot that exists -->
                <template v-if="child.header" #header>
                    <div class="h-40 bg-surface-100 dark:bg-surface-800 flex items-center justify-center">Header</div>
                </template>

                <template v-if="child.title" #title>{{ child.title }}</template>
                <template v-if="child.subtitle" #subtitle>{{ child.subtitle }}</template>

                <template #content>
                    <p class="m-0">{{ body }}</p>
                </template>

                <template v-if="child.footer" #footer>
                    <div class="flex gap-4">
                        <Button label="Cancel" severity="secondary" outlined class="w-full" />
                        <Button label="Save" class="w-full" />
                    </div>
                </template>
            </Card>
        </template>
    </DocPlayground>
</template>

<script>
import DocPlayground from '@/components/doc/playground/DocPlayground.vue';
import schema, { BODY } from './playground/schema';

export default {
    components: {
        DocPlayground
    },
    data() {
        return {
            schema,
            body: BODY
        };
    }
};
</script>
