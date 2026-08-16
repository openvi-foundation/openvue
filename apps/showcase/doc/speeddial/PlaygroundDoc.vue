<template>
    <DocPlayground :schema="schema" @reset="clear">
        <!-- the same box the generated snippet carries, because the dial positions its items against it -->
        <template #preview="{ props }">
            <div class="relative h-80 w-80">
                <SpeedDial v-bind="props" :model="items" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
        </template>
    </DocPlayground>
</template>

<script>
import DocPlayground from '@/components/doc/playground/DocPlayground.vue';
import schema, { ACTIONS } from './playground/schema';

export default {
    components: {
        DocPlayground
    },
    data() {
        return {
            schema,
            items: ACTIONS
        };
    },
    methods: {
        clear() {
            // a SpeedDial holds no value of its own, so a reset has nothing to clear
        }
    }
};
</script>
