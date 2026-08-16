import { closingScript } from '@/components/doc/playground/serialize';
import { defineSchema } from '@/components/doc/playground/schema';

/* the password field binds a string and takes everything else from the rail */
const BINDINGS = ['v-model="value"'];

const template = (tag) => `<template>
    <div class="card flex justify-center">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'Password',
    groups: [
        {
            title: 'Behaviour',
            controls: ['feedback', 'toggleMask', 'autofocus', 'maxlength', 'minlength']
        },
        {
            title: 'Appearance',
            controls: ['showClear', 'size', 'variant', 'placeholder', 'fluid', 'inputClass', 'panelClass', 'overlayClass']
        },
        {
            title: 'State',
            controls: ['invalid', 'disabled', 'required', 'unstyled', 'readonly']
        },
        {
            title: 'Icons',
            controls: [
                { prop: 'maskIcon', when: (state) => state.toggleMask },
                { prop: 'unmaskIcon', when: (state) => state.toggleMask }
            ]
        },
        {
            title: 'Messages',
            controls: [
                { prop: 'promptLabel', when: (state) => state.feedback },
                { prop: 'weakLabel', when: (state) => state.feedback },
                { prop: 'mediumLabel', when: (state) => state.feedback },
                { prop: 'strongLabel', when: (state) => state.feedback },
                { prop: 'hidePasswordLabel', when: (state) => state.toggleMask },
                { prop: 'showPasswordLabel', when: (state) => state.toggleMask }
            ]
        },
        {
            title: 'Identity',
            controls: ['name', 'appendTo', 'inputId', 'panelId', 'overlayId', 'ariaLabelledby', 'ariaLabel']
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
