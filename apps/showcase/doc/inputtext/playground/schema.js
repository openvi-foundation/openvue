import { closingScript } from '@/components/doc/playground/serialize';
import { defineSchema } from '@/components/doc/playground/schema';

/* the text field binds a string and takes everything else from the rail */
const BINDINGS = ['v-model="value"'];

const template = (tag) => `<template>
    <div class="card flex justify-center">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'InputText',
    groups: [
        {
            title: 'Behaviour',
            controls: ['maxlength', 'minlength', 'autofocus', 'spellcheck']
        },
        {
            title: 'Appearance',
            controls: ['size', 'variant', 'placeholder']
        },
        {
            title: 'State',
            controls: ['unstyled', 'disabled', 'readonly', 'required']
        },
        {
            title: 'Identity',
            controls: ['name']
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
            value: ''
        };
    }
};
${closingScript}`,
                composition: `${template(tag)}

<script setup>
import { ref } from 'vue';

const value = ref('');
${closingScript}`
            };
        }
    }
});
