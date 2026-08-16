import { PROSE } from '@/components/doc/playground/fixtures';
import { defineSchema } from '@/components/doc/playground/schema';
import { closingScript } from '@/components/doc/playground/serialize';

/* which panel opens is state the component writes back, and `multiple` changes its shape from a key to a list */
const BINDINGS = ['v-model:value="active"'];

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

/**
 * An Accordion is a stack of panels, so how many there are and whether one of them refuses to open
 * are markup decisions rather than properties of the Accordion itself. `disabled` is a documented
 * property all the same, just of AccordionPanel, which is where the control reads its typing from.
 */
export function children({ panels, disabled }) {
    return Array.from({ length: panels }, (_, index) => {
        /* the last panel carries it, so raising the count does not move which one is disabled */
        const off = disabled && index === panels - 1;

        return `<AccordionPanel value="${index}"${off ? ' disabled' : ''}>
    <AccordionHeader>Header ${ROMAN[index] ?? index + 1}</AccordionHeader>
    <AccordionContent>
        <p class="m-0">${PROSE[index % PROSE.length]}</p>
    </AccordionContent>
</AccordionPanel>`;
    }).join('\n');
}

const template = (tag) => `<template>
    <div class="card">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'Accordion',
    groups: [
        {
            title: 'Structure',
            controls: [
                { prop: 'panels', structure: true, control: 'number', default: 3, min: 1, max: 6, label: 'Panels' },
                { prop: 'disabled', of: 'AccordionPanel', control: 'boolean', label: 'Last panel disabled' }
            ]
        },
        {
            title: 'Behaviour',
            controls: ['multiple', 'lazy', 'selectOnFocus']
        },
        {
            title: 'Icons',
            controls: ['expandIcon', 'collapseIcon']
        },
        {
            title: 'Identity',
            controls: [{ prop: 'tabindex', min: -1 }, 'unstyled']
        }
    ],
    snippet: {
        bindings: BINDINGS,
        children,
        build: ({ tag, props }) => ({
            options: `${template(tag)}

<script>
export default {
    data() {
        return {
            /* \`multiple\` makes the open panel a list of keys rather than one */
            active: ${props.multiple ? "['0']" : "'0'"}
        };
    }
};
${closingScript}`,
            composition: `${template(tag)}

<script setup>
import { ref } from 'vue';

/* \`multiple\` makes the open panel a list of keys rather than one */
const active = ref(${props.multiple ? "['0']" : "'0'"});
${closingScript}`
        })
    }
});
