<template>
    <DocPlayground :schema="schema">
        <template #preview="{ props, child }">
            <div v-if="props.layout === 'vertical'" class="flex w-full md:w-[36rem] h-40">
                <div class="flex-1 flex items-center justify-center">Left</div>
                <!-- the slot is conditional rather than the text inside it: Divider draws its content box whenever a default slot exists at all -->
                <Divider v-bind="props">
                    <template v-if="child.content" #default>{{ child.content }}</template>
                </Divider>
                <div class="flex-1 flex items-center justify-center">Right</div>
            </div>

            <div v-else class="w-full md:w-[36rem]">
                <p>Above</p>
                <Divider v-bind="props">
                    <template v-if="child.content" #default>{{ child.content }}</template>
                </Divider>
                <p>Below</p>
            </div>
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
