import { closingScript } from '@/components/doc/playground/serialize';
import { defineSchema } from '@/components/doc/playground/schema';

/* a lone checkbox binds a boolean, which is what `binary` means; the rail never removes it */
const BINDINGS = ['v-model="checked"', 'binary'];

const template = (tag) => `<template>
    <div class="card flex justify-center">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'Checkbox',
    groups: [
        {
            title: 'Behaviour',
            controls: ['indeterminate']
        },
        {
            title: 'Appearance',
            controls: ['size', 'variant']
        },
        {
            title: 'State',
            controls: ['invalid', 'disabled', 'readonly', 'required', 'unstyled']
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
            checked: false
        };
    }
};
${closingScript}`,
                composition: `${template(tag)}

<script setup>
import { ref } from 'vue';

const checked = ref(false);
${closingScript}`
            };
        }
    }
});
