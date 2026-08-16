import { closingScript } from '@/components/doc/playground/serialize';
import { defineSchema } from '@/components/doc/playground/schema';

/* the textarea binds a string and takes everything else from the rail */
const BINDINGS = ['v-model="value"'];

const template = (tag) => `<template>
    <div class="card flex justify-center">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'Textarea',
    groups: [
        {
            title: 'Behaviour',
            controls: ['autoResize', { prop: 'rows', min: 1 }, { prop: 'cols', min: 1 }, 'maxlength', 'autocomplete']
        },
        {
            title: 'Appearance',
            controls: ['size', 'variant', 'fluid', 'placeholder']
        },
        {
            title: 'State',
            controls: ['invalid', 'unstyled', 'disabled', 'readonly', 'required']
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
