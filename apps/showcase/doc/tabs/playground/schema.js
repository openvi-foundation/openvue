import { PROSE } from '@/components/doc/playground/fixtures';
import { defineSchema } from '@/components/doc/playground/schema';
import { closingScript } from '@/components/doc/playground/serialize';

/* which tab is open is state the component writes back, not something to configure */
const BINDINGS = ['v-model:value="active"'];

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

const label = (index) => ROMAN[index] ?? index + 1;

/**
 * Tabs are a list of headers and a matching list of panels, so the count is markup rather than a
 * property. `disabled` belongs to Tab, which is where its typing is read from.
 */
export function children({ tabs, disabled }) {
    const headers = Array.from({ length: tabs }, (_, index) => `    <Tab value="${index}"${disabled && index === tabs - 1 ? ' disabled' : ''}>Header ${label(index)}</Tab>`).join('\n');

    const panels = Array.from(
        { length: tabs },
        (_, index) => `    <TabPanel value="${index}">
        <p class="m-0">${PROSE[index % PROSE.length]}</p>
    </TabPanel>`
    ).join('\n');

    return `<TabList>\n${headers}\n</TabList>\n<TabPanels>\n${panels}\n</TabPanels>`;
}

const template = (tag) => `<template>
    <div class="card">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'Tabs',
    groups: [
        {
            title: 'Structure',
            controls: [
                /* enough of them to overflow the rail, which is the only way `scrollable` shows anything */
                { prop: 'tabs', structure: true, control: 'number', default: 3, min: 1, max: 10, label: 'Tabs' },
                { prop: 'disabled', of: 'Tab', control: 'boolean', label: 'Last tab disabled' }
            ]
        },
        {
            title: 'Behaviour',
            controls: ['lazy', 'selectOnFocus']
        },
        {
            title: 'Appearance',
            controls: ['scrollable', { prop: 'showNavigators', when: (state) => state.scrollable }, 'unstyled']
        },
        {
            title: 'Identity',
            controls: [{ prop: 'tabindex', min: -1 }]
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
            active: '0'
        };
    }
};
${closingScript}`,
            composition: `${template(tag)}

<script setup>
import { ref } from 'vue';

const active = ref('0');
${closingScript}`
        })
    }
});
