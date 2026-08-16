import { closingScript } from '@/components/doc/playground/serialize';
import { defineSchema } from '@/components/doc/playground/schema';

/* the field binds a number and the rail decides how that number is written */
const BINDINGS = ['v-model="value"'];

const template = (tag) => `<template>
    <div class="card flex justify-center">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'InputNumber',
    groups: [
        {
            title: 'Behaviour',
            controls: [
                'format',
                'showButtons',
                { prop: 'buttonLayout', when: (state) => state.showButtons },
                { prop: 'incrementButtonClass', when: (state) => state.showButtons },
                { prop: 'decrementButtonClass', when: (state) => state.showButtons },
                'locale',
                'localeMatcher',
                'mode',
                'prefix',
                'suffix',
                { prop: 'currency', when: (state) => state.mode === 'currency' },
                { prop: 'currencyDisplay', when: (state) => state.mode === 'currency' },
                'useGrouping',
                'minFractionDigits',
                'maxFractionDigits',
                'min',
                'max',
                'step',
                'allowEmpty',
                'highlightOnFocus'
            ]
        },
        {
            title: 'Appearance',
            controls: ['showClear', 'size', 'variant', 'placeholder', 'fluid', 'inputClass']
        },
        {
            title: 'State',
            controls: ['invalid', 'disabled', 'readonly', 'unstyled']
        },
        {
            title: 'Icons',
            controls: [
                { prop: 'incrementButtonIcon', when: (state) => state.showButtons },
                { prop: 'incrementIcon', when: (state) => state.showButtons },
                { prop: 'decrementButtonIcon', when: (state) => state.showButtons },
                { prop: 'decrementIcon', when: (state) => state.showButtons }
            ]
        },
        {
            title: 'Identity',
            controls: ['name', 'inputId', 'ariaLabelledby', 'ariaLabel']
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
            value: 42
        };
    }
};
${closingScript}`,
                composition: `${template(tag)}

<script setup>
import { ref } from 'vue';

const value = ref(42);
${closingScript}`
            };
        }
    }
});
