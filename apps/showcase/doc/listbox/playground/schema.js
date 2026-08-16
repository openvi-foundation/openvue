import { CITIES } from '@/components/doc/playground/fixtures';
import { closingScript, serialize } from '@/components/doc/playground/serialize';
import { defineSchema } from '@/components/doc/playground/schema';

/* re-exported so the preview and the generated snippet are working from the very same data */
export { CITIES };

/* the options and the property that labels them are what make the list a list, so they are bound rather than offered as controls */
const BINDINGS = ['v-model="selectedCity"', ':options="cities"', 'optionLabel="name"'];

const template = (tag) => `<template>
    <div class="card flex justify-center">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'Listbox',
    groups: [
        {
            title: 'Behaviour',
            controls: [
                'multiple',
                { prop: 'metaKeySelection', when: (state) => state.multiple },
                'filter',
                { prop: 'filterPlaceholder', when: (state) => state.filter },
                { prop: 'filterLocale', when: (state) => state.filter },
                { prop: 'filterMatchMode', when: (state) => state.filter },
                'autoOptionFocus',
                'selectOnFocus',
                'focusOnHover',
                'highlightOnSelect'
            ]
        },
        {
            title: 'Appearance',
            controls: ['scrollHeight', 'fluid', 'checkmark', 'striped']
        },
        {
            title: 'State',
            controls: ['invalid', 'disabled', 'unstyled']
        },
        {
            title: 'Icons',
            controls: [{ prop: 'filterIcon', when: (state) => state.filter }]
        },
        {
            title: 'Messages',
            controls: [{ prop: 'filterMessage', when: (state) => state.filter }, { prop: 'selectionMessage', when: (state) => state.multiple }, 'emptySelectionMessage', { prop: 'emptyFilterMessage', when: (state) => state.filter }, 'emptyMessage']
        },
        {
            title: 'Identity',
            controls: ['name', 'dataKey', 'tabindex', 'ariaLabel', 'ariaLabelledby']
        }
    ],
    snippet: {
        bindings: BINDINGS,
        build: ({ tag, props }) => {
            // a multiple listbox binds an array of picks, a single one binds the picked option
            const initial = props.multiple ? '[]' : 'null';

            return {
                options: `${template(tag)}

<script>
export default {
    data() {
        return {
            selectedCity: ${initial},
            cities: ${serialize(CITIES, 12)}
        };
    }
};
${closingScript}`,
                composition: `${template(tag)}

<script setup>
import { ref } from 'vue';

const cities = ${serialize(CITIES, 0)};

const selectedCity = ref(${initial});
${closingScript}`
            };
        }
    }
});
