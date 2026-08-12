import { REGIONS } from '@/components/doc/playground/fixtures';
import { closingScript, serialize } from '@/components/doc/playground/serialize';
import { defineSchema } from '@/components/doc/playground/schema';

/* re-exported so the preview and the generated snippet are working from the very same data */
export { REGIONS };

/* the nesting is spelled out by the option properties, which the rail must not be able to take apart */
const BINDINGS = ['v-model="selectedCity"', ':options="regions"', 'optionLabel="cname"', 'optionGroupLabel="name"', ":optionGroupChildren=\"['countries', 'cities']\""];

const template = (tag) => `<template>
    <div class="card flex justify-center">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'CascadeSelect',
    groups: [
        {
            title: 'Behaviour',
            controls: ['autoOptionFocus', 'selectOnFocus', 'focusOnHover', 'searchLocale']
        },
        {
            title: 'Appearance',
            controls: ['placeholder', 'breakpoint', 'size', 'variant', 'showClear', 'inputClass', 'overlayClass', 'fluid']
        },
        {
            title: 'State',
            controls: ['invalid', 'disabled', 'loading', 'unstyled']
        },
        {
            title: 'Icons',
            controls: ['clearIcon', 'dropdownIcon', 'loadingIcon', 'optionGroupIcon']
        },
        {
            title: 'Messages',
            controls: ['searchMessage', 'selectionMessage', 'emptySelectionMessage', 'emptySearchMessage', 'emptyMessage']
        },
        {
            title: 'Identity',
            controls: ['name', 'dataKey', 'inputId', 'appendTo', 'tabindex', 'ariaLabelledby', 'ariaLabel']
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
            selectedCity: null,
            regions: ${serialize(REGIONS, 12)}
        };
    }
};
${closingScript}`,
                composition: `${template(tag)}

<script setup>
import { ref } from 'vue';

const regions = ${serialize(REGIONS, 0)};

const selectedCity = ref(null);
${closingScript}`
            };
        }
    }
});
