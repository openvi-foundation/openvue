import { closingScript } from '@/components/doc/playground/serialize';
import { defineSchema } from '@/components/doc/playground/schema';

/* the picker binds a colour in whichever format the rail asks for */
const BINDINGS = ['v-model="color"'];

const template = (tag) => `<template>
    <div class="card flex justify-center">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'ColorPicker',
    groups: [
        {
            title: 'Behaviour',
            controls: ['format']
        },
        {
            title: 'Appearance',
            controls: ['inline']
        },
        {
            title: 'State',
            controls: ['invalid', 'disabled', 'unstyled']
        },
        {
            title: 'Identity',
            controls: ['name', 'tabindex', 'autoZIndex', 'baseZIndex', 'inputId', 'appendTo']
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
            color: '6466f1'
        };
    }
};
${closingScript}`,
                composition: `${template(tag)}

<script setup>
import { ref } from 'vue';

const color = ref('6466f1');
${closingScript}`
            };
        }
    }
});
