import { CITIES } from '@/components/doc/playground/fixtures';
import { closingScript, serialize } from '@/components/doc/playground/serialize';
import { defineSchema } from '@/components/doc/playground/schema';

/* re-exported so the preview and the generated snippet are choosing from the very same list */
export { CITIES };

/*
 * The options and the property that labels them are what make a Select a Select, so they are bound
 * rather than offered as controls: a playground that lets you clear `optionLabel` is a playground
 * that renders a column of "[object Object]".
 */
const BINDINGS = ['v-model="selectedCity"', ':options="cities"', 'optionLabel="name"'];

const template = (tag) => `<template>
    <div class="card flex justify-center">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'Select',
    /*
     * Ordered by what a visitor reaches for first. The two groups the rail opens on are Behaviour
     * and Appearance; everything after that is one click away.
     */
    groups: [
        {
            title: 'Behaviour',
            controls: [
                'editable',
                'filter',
                { prop: 'filterPlaceholder', when: (state) => state.filter },
                { prop: 'filterMatchMode', when: (state) => state.filter },
                { prop: 'resetFilterOnHide', when: (state) => state.filter },
                { prop: 'resetFilterOnClear', when: (state) => state.filter },
                { prop: 'autoFilterFocus', when: (state) => state.filter },
                'autoOptionFocus',
                'selectOnFocus',
                'focusOnHover',
                'highlightOnSelect'
            ]
        },
        {
            title: 'Appearance',
            controls: ['variant', 'size', 'fluid', 'placeholder', 'showClear', 'checkmark', 'scrollHeight', 'inputClass', 'panelClass', 'overlayClass']
        },
        {
            title: 'State',
            controls: ['disabled', 'invalid', 'loading', 'unstyled']
        },
        {
            title: 'Icons',
            controls: ['dropdownIcon', 'clearIcon', 'loadingIcon', { prop: 'filterIcon', when: (state) => state.filter }]
        },
        {
            title: 'Messages',
            controls: ['emptyMessage', 'emptySelectionMessage', 'selectionMessage', { prop: 'emptyFilterMessage', when: (state) => state.filter }, { prop: 'filterMessage', when: (state) => state.filter }]
        },
        {
            title: 'Identity',
            controls: ['name', 'inputId', 'labelId', 'dataKey', 'appendTo', 'tabindex', 'ariaLabel', 'ariaLabelledby']
        }
    ],
    snippet: {
        bindings: BINDINGS,
        build: ({ tag }) => ({
            options: `${template(tag)}

<script>
export default {
    data() {
        return {
            selectedCity: null,
            cities: ${serialize(CITIES, 12)}
        };
    }
};
${closingScript}`,
            composition: `${template(tag)}

<script setup>
import { ref } from 'vue';

const selectedCity = ref(null);
const cities = ${serialize(CITIES, 0)};
${closingScript}`
        })
    }
});
