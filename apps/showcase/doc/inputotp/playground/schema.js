import { closingScript } from '@/components/doc/playground/serialize';
import { defineSchema } from '@/components/doc/playground/schema';

/* the one time code binds a string, which the rail sets the length and the alphabet of */
const BINDINGS = ['v-model="value"'];

const template = (tag) => `<template>
    <div class="card flex justify-center">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'InputOtp',
    groups: [
        {
            title: 'Behaviour',
            controls: [{ prop: 'length', min: 1, max: 8 }, 'mask', 'integerOnly']
        },
        {
            title: 'Appearance',
            controls: ['size', 'variant']
        },
        {
            title: 'State',
            controls: ['invalid', 'disabled', 'readonly', 'unstyled']
        },
        {
            title: 'Identity',
            controls: ['name', 'tabindex']
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
