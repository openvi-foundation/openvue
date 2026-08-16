<template>
    <DocPlayground :schema="schema" @update:props="onProps" @update:child="onChild" @reset="clear">
        <template #preview="{ props, child }">
            <Accordion v-bind="props" v-model:value="active" class="w-full md:w-[36rem]">
                <AccordionPanel v-for="(panel, index) in panels(child)" :key="panel.value" :value="panel.value" :disabled="child.disabled && index === child.panels - 1">
                    <AccordionHeader>Header {{ panel.label }}</AccordionHeader>
                    <AccordionContent>
                        <p class="m-0">{{ panel.prose }}</p>
                    </AccordionContent>
                </AccordionPanel>
            </Accordion>
        </template>
    </DocPlayground>
</template>

<script>
import { PROSE } from '@/components/doc/playground/fixtures';
import DocPlayground from '@/components/doc/playground/DocPlayground.vue';
import schema from './playground/schema';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

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
        panels(child) {
            return Array.from({ length: child.panels }, (_, index) => ({
                value: String(index),
                label: ROMAN[index] ?? index + 1,
                prose: PROSE[index % PROSE.length]
            }));
        },
        /*
         * `multiple` changes what the model is rather than how it behaves: one open key becomes a
         * list of them. Carrying the old shape across leaves the Accordion reading a string as a
         * list of characters, so the value is rebuilt whenever the mode changes.
         */
        onProps(props) {
            const multiple = Boolean(props.multiple);

            if (multiple !== Array.isArray(this.active)) this.active = multiple ? ['0'] : '0';
        },
        /* turning the count down can leave an open panel pointing at one that no longer exists */
        onChild({ panels }) {
            const gone = (key) => Number(key) >= panels;

            if (Array.isArray(this.active)) this.active = this.active.filter((key) => !gone(key));
            else if (gone(this.active)) this.active = String(panels - 1);
        },
        clear() {
            this.active = '0';
        }
    }
};
</script>
