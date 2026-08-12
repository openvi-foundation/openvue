import { closingScript } from '@/components/doc/playground/serialize';
import { defineSchema } from '@/components/doc/playground/schema';

/* the mask is the whole point of the component, so the preview fixes one rather than letting the rail empty it */
const BINDINGS = ['v-model="value"', 'mask="99-999999"'];

const template = (tag) => `<template>
    <div class="card flex justify-center">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'InputMask',
    groups: [
        {
            title: 'Behaviour',
            controls: ['slotChar', 'id', 'autoClear', 'unmask']
        },
        {
            title: 'Appearance',
            controls: ['placeholder', 'size', 'variant', 'fluid']
        },
        {
            title: 'State',
            controls: ['readonly', 'invalid', 'disabled', 'unstyled']
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
            value: null
        };
    }
};
${closingScript}`,
                composition: `${template(tag)}

<script setup>
import { ref } from 'vue';

const value = ref(null);
${closingScript}`
            };
        }
    }
});
