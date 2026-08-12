import { COUNTRIES } from '@/components/doc/playground/fixtures';
import { closingScript, serialize } from '@/components/doc/playground/serialize';
import { defineSchema } from '@/components/doc/playground/schema';

/* re-exported so the preview and the generated snippet are filtering the very same list */
export { COUNTRIES };

/** Every generated variant needs these to query at all, so they sit ahead of the chosen props. */
const BINDINGS = ['v-model="value"', ':suggestions="items"', '@complete="search"'];

const template = (tag) => `<template>
    <div class="card flex justify-center">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'AutoComplete',
    /*
     * Every property the typings describe well enough to drive a control, except two kinds: those
     * typed `any`, `object`, `Record<string, any>` or `PassThrough<...>`, which no control can
     * produce a value for; and the ones that describe the shape of the data — optionLabel and the
     * option group properties — since the suggestions here are a flat list of strings and naming a
     * field on them would only break the preview.
     */
    groups: [
        {
            title: 'Behaviour',
            controls: [
                'dropdown',
                // the mode only decides what an open dropdown queries with, so it follows the button
                { prop: 'dropdownMode', when: (state) => state.dropdown },
                'multiple',
                'typeahead',
                'forceSelection',
                'completeOnFocus',
                { prop: 'minLength', min: 1, max: 5 },
                { prop: 'delay', min: 0, max: 2000, step: 100 },
                'autoOptionFocus',
                'selectOnFocus',
                'focusOnHover'
            ]
        },
        {
            title: 'Appearance',
            controls: ['variant', 'size', 'fluid', 'placeholder', 'showClear', 'scrollHeight', 'inputClass', 'panelClass', 'overlayClass', 'dropdownClass']
        },
        {
            title: 'State',
            controls: ['disabled', 'invalid', 'loading', 'unstyled']
        },
        {
            title: 'Icons',
            controls: ['dropdownIcon', 'loadingIcon', 'loader', 'removeTokenIcon', 'chipIcon']
        },
        {
            title: 'Messages',
            controls: ['showEmptyMessage', 'emptySearchMessage', 'emptySelectionMessage', 'searchMessage', 'selectionMessage', 'searchLocale']
        },
        {
            title: 'Identity',
            controls: ['name', 'inputId', 'appendTo', 'tabindex', 'ariaLabel', 'ariaLabelledby']
        }
    ],
    snippet: {
        bindings: BINDINGS,
        build: ({ tag, props }) => {
            // a multiple AutoComplete binds an array of picks, a single one binds the picked value
            const initial = props.multiple ? '[]' : 'null';

            return {
                options: `${template(tag)}

<script>
export default {
    data() {
        return {
            value: ${initial},
            items: [],
            countries: ${serialize(COUNTRIES, 12)}
        };
    },
    methods: {
        search(event) {
            const query = event.query.toLowerCase();

            this.items = this.countries.filter((country) => country.toLowerCase().includes(query));
        }
    }
};
${closingScript}`,
                composition: `${template(tag)}

<script setup>
import { ref } from 'vue';

const countries = ${serialize(COUNTRIES, 0)};

const value = ref(${initial});
const items = ref([]);

const search = (event) => {
    const query = event.query.toLowerCase();

    items.value = countries.filter((country) => country.toLowerCase().includes(query));
};
${closingScript}`
            };
        }
    }
});
