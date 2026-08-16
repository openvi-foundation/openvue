import { closingScript } from '@/components/doc/playground/serialize';
import { defineSchema } from '@/components/doc/playground/schema';

/* a radio reports which value it carries, so the value is fixed and the model says whether it is the chosen one */
const BINDINGS = ['v-model="picked"', 'value="one"'];

const template = (tag) => `<template>
    <div class="card flex justify-center">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'RadioButton',
    groups: [
        {
            title: 'Appearance',
            controls: ['size', 'variant', 'inputClass']
        },
        {
            title: 'State',
            controls: ['invalid', 'disabled', 'readonly', 'unstyled']
        },
        {
            title: 'Identity',
            controls: ['name', 'tabindex', 'inputId', 'ariaLabelledby', 'ariaLabel']
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
            picked: 'one'
        };
    }
};
${closingScript}`,
                composition: `${template(tag)}

<script setup>
import { ref } from 'vue';

const picked = ref('one');
${closingScript}`
            };
        }
    }
});
