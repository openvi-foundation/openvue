import { closingScript } from '@/components/doc/playground/serialize';
import { defineSchema } from '@/components/doc/playground/schema';

/* the knob is a value between its own bounds, and the rail owns those bounds */
const BINDINGS = ['v-model="value"'];

const template = (tag) => `<template>
    <div class="card flex justify-center">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'Knob',
    groups: [
        {
            title: 'Behaviour',
            controls: ['step', 'min', 'max', 'valueColor', 'rangeColor', 'textColor', 'strokeWidth', 'showValue', 'valueTemplate']
        },
        {
            title: 'Appearance',
            controls: ['size']
        },
        {
            title: 'State',
            controls: ['invalid', 'disabled', 'readonly', 'unstyled']
        },
        {
            title: 'Identity',
            controls: ['name', 'tabindex', 'ariaLabelledby', 'ariaLabel']
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
            value: 50
        };
    }
};
${closingScript}`,
                composition: `${template(tag)}

<script setup>
import { ref } from 'vue';

const value = ref(50);
${closingScript}`
            };
        }
    }
});
