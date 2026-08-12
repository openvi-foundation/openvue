import { closingScript } from '@/components/doc/playground/serialize';
import { defineSchema } from '@/components/doc/playground/schema';

/* the button is on or off and nothing in the rail changes that */
const BINDINGS = ['v-model="checked"'];

const template = (tag) => `<template>
    <div class="card flex justify-center">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'ToggleButton',
    groups: [
        {
            title: 'Appearance',
            controls: ['fluid', 'size']
        },
        {
            title: 'State',
            controls: ['invalid', 'disabled', 'readonly', 'unstyled']
        },
        {
            title: 'Icons',
            controls: ['onIcon', 'offIcon']
        },
        {
            title: 'Messages',
            controls: ['onLabel', 'offLabel']
        },
        {
            title: 'Identity',
            controls: ['name', 'tabindex', 'ariaLabelledby']
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
