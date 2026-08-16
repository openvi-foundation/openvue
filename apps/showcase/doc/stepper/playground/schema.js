import { defineSchema } from '@/components/doc/playground/schema';
import { closingScript } from '@/components/doc/playground/serialize';

/* which step is showing is state the component writes back as the visitor moves through it */
const BINDINGS = ['v-model:value="active"'];

const ROMAN = ['I', 'II', 'III', 'IV', 'V'];

const label = (index) => ROMAN[index] ?? index + 1;

const indent = (markup, width = 8) =>
    markup
        .split('\n')
        .map((line) => (line.trim() ? `${' '.repeat(width)}${line}` : line))
        .join('\n');

const content = (index) => `<div class="flex flex-col h-48">
    <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">Content ${label(index)}</div>
</div>`;

/** The buttons are the only way through a linear stepper, so every step carries the ones it needs. */
function navigation(index, steps) {
    const back = index > 0 ? `<Button label="Back" severity="secondary" @click="activateCallback('${index}')" />` : '';
    const next = index < steps - 1 ? `<Button label="Next" @click="activateCallback('${index + 2}')" />` : '';

    return `<div class="flex py-6 gap-2">\n${[back, next]
        .filter(Boolean)
        .map((button) => `    ${button}`)
        .join('\n')}\n</div>`;
}

/**
 * Stepper has no property for its orientation: a horizontal one lists its steps and then its panels,
 * and a vertical one pairs each step with its panel inside a StepItem. The layout is therefore which
 * markup gets written, which is what makes it a structure control rather than a property.
 */
export function children({ layout, steps, disabled }) {
    const off = (index) => (disabled && index === steps - 1 ? ' disabled' : '');

    if (layout === 'vertical') {
        return Array.from(
            { length: steps },
            (_, index) => `<StepItem value="${index + 1}">
    <Step${off(index)}>Header ${label(index)}</Step>
    <StepPanel v-slot="{ activateCallback }">
${indent(content(index))}
${indent(navigation(index, steps))}
    </StepPanel>
</StepItem>`
        ).join('\n');
    }

    const list = Array.from({ length: steps }, (_, index) => `    <Step value="${index + 1}"${off(index)}>Header ${label(index)}</Step>`).join('\n');

    const panels = Array.from(
        { length: steps },
        (_, index) => `    <StepPanel v-slot="{ activateCallback }" value="${index + 1}">
${indent(content(index), 8)}
${indent(navigation(index, steps), 8)}
    </StepPanel>`
    ).join('\n');

    return `<StepList>\n${list}\n</StepList>\n<StepPanels>\n${panels}\n</StepPanels>`;
}

const template = (tag) => `<template>
    <div class="card">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'Stepper',
    groups: [
        {
            title: 'Structure',
            controls: [
                /* Stepper has no orientation property: vertical is a different composition, not a setting */
                { prop: 'layout', structure: true, control: 'select', options: ['horizontal', 'vertical'], default: 'horizontal' },
                { prop: 'steps', structure: true, control: 'number', default: 3, min: 1, max: 5, label: 'Steps' },
                { prop: 'disabled', of: 'Step', control: 'boolean', label: 'Last step disabled' }
            ]
        },
        {
            title: 'Behaviour',
            controls: ['linear']
        },
        {
            title: 'Appearance',
            controls: ['unstyled']
        }
    ],
    snippet: {
        bindings: BINDINGS,
        children,
        build: ({ tag }) => ({
            options: `${template(tag)}

<script>
export default {
    data() {
        return {
            active: '1'
        };
    }
};
${closingScript}`,
            composition: `${template(tag)}

<script setup>
import { ref } from 'vue';

const active = ref('1');
${closingScript}`
        })
    }
});
