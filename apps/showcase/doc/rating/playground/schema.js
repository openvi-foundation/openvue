import { closingScript } from '@/components/doc/playground/serialize';
import { defineSchema } from '@/components/doc/playground/schema';

/* the rating is a count of stars, which the rail sets the ceiling for */
const BINDINGS = ['v-model="value"'];

const template = (tag) => `<template>
    <div class="card flex justify-center">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'Rating',
    groups: [
        {
            title: 'Behaviour',
            controls: [{ prop: 'stars', min: 1 }]
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
            value: 3
        };
    }
};
${closingScript}`,
                composition: `${template(tag)}

<script setup>
import { ref } from 'vue';

const value = ref(3);
${closingScript}`
            };
        }
    }
});
