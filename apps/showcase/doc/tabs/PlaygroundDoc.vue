<template>
    <DocPlayground :schema="schema" @update:child="onChild" @reset="clear">
        <template #preview="{ props, child }">
            <Tabs v-bind="props" v-model:value="active" class="w-full md:w-[36rem]">
                <TabList>
                    <Tab v-for="(tab, index) in tabs(child)" :key="tab.value" :value="tab.value" :disabled="child.disabled && index === child.tabs - 1">Header {{ tab.label }}</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel v-for="tab in tabs(child)" :key="tab.value" :value="tab.value">
                        <p class="m-0">{{ tab.prose }}</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </template>
    </DocPlayground>
</template>

<script>
import { PROSE } from '@/components/doc/playground/fixtures';
import DocPlayground from '@/components/doc/playground/DocPlayground.vue';
import schema from './playground/schema';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export default {
    components: {
        DocPlayground
    },
    data() {
        return {
            schema,
            active: '0'
        };
    },
    methods: {
        tabs(child) {
            return Array.from({ length: child.tabs }, (_, index) => ({
                value: String(index),
                label: ROMAN[index] ?? index + 1,
                prose: PROSE[index % PROSE.length]
            }));
        },
        /* turning the count down can leave the open tab pointing at one that no longer exists */
        onChild({ tabs }) {
            if (Number(this.active) >= tabs) this.active = String(tabs - 1);
        },
        clear() {
            this.active = '0';
        }
    }
};
</script>
