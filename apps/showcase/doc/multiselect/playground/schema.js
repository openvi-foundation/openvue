import { CITIES } from '@/components/doc/playground/fixtures';
import { closingScript, serialize } from '@/components/doc/playground/serialize';
import { defineSchema } from '@/components/doc/playground/schema';

/* re-exported so the preview and the generated snippet are working from the very same data */
export { CITIES };

/* the options and the property that labels them are what make the component usable, so they are bound rather than offered as controls */
const BINDINGS = ['v-model="selectedCities"', ':options="cities"', 'optionLabel="name"'];

const template = (tag) => `<template>
    <div class="card flex justify-center">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'MultiSelect',
    groups: [
        {
            title: 'Behaviour',
            controls: [
                { prop: 'resetFilterOnClear', when: (state) => state.filter },
                'filter',
                { prop: 'filterPlaceholder', when: (state) => state.filter },
                { prop: 'filterLocale', when: (state) => state.filter },
                { prop: 'filterMatchMode', when: (state) => state.filter },
                { prop: 'maxSelectedLabels', min: 1 },
                { prop: 'selectionLimit', min: 1 },
                'showToggleAll',
                'selectAll',
                { prop: 'resetFilterOnHide', when: (state) => state.filter },
                'autoOptionFocus',
                { prop: 'autoFilterFocus', when: (state) => state.filter },
                'focusOnHover',
                'highlightOnSelect'
            ]
        },
        {
            title: 'Appearance',
            controls: ['scrollHeight', 'placeholder', 'size', 'variant', 'fluid', 'showClear', 'display']
        },
        {
            title: 'State',
            controls: ['invalid', 'disabled', 'loading', 'unstyled']
        },
        {
            title: 'Icons',
            controls: [
                'clearIcon',
                'checkboxIcon',
                'dropdownIcon',
                { prop: 'filterIcon', when: (state) => state.filter },
                'loadingIcon',
                { prop: 'removeTokenIcon', when: (state) => state.display === 'chip' },
                { prop: 'chipIcon', when: (state) => state.display === 'chip' }
            ]
        },
        {
            title: 'Messages',
            controls: [
                { prop: 'selectedItemsLabel', when: (state) => state.maxSelectedLabels != null },
                { prop: 'filterMessage', when: (state) => state.filter },
                'selectionMessage',
                'emptySelectionMessage',
                { prop: 'emptyFilterMessage', when: (state) => state.filter },
                'emptyMessage'
            ]
        },
        {
            title: 'Identity',
            controls: ['name', 'inputId', 'dataKey', 'appendTo', 'tabindex', 'ariaLabel', 'ariaLabelledby']
        }
    ],
    snippet: {
        bindings: BINDINGS,
        build: ({ tag }) => {
            return {
                options: `${template(tag)}

<script>
export default {
    data() {
        return {
            selectedCities: [],
            cities: ${serialize(CITIES, 12)}
        };
    }
};
${closingScript}`,
                composition: `${template(tag)}

<script setup>
import { ref } from 'vue';

const cities = ${serialize(CITIES, 0)};

const selectedCities = ref([]);
${closingScript}`
            };
        }
    }
});
