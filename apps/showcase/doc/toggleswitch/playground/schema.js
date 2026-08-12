import { closingScript } from '@/components/doc/playground/serialize';
import { defineSchema } from '@/components/doc/playground/schema';

/* the switch is on or off and nothing in the rail changes that */
const BINDINGS = ['v-model="checked"'];

const template = (tag) => `<template>
    <div class="card flex justify-center">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'ToggleSwitch',
    groups: [
        {
            title: 'Appearance',
            controls: ['inputClass']
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
