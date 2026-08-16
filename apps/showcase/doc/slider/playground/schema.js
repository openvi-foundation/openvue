import { closingScript } from '@/components/doc/playground/serialize';
import { defineSchema } from '@/components/doc/playground/schema';

/* a slider needs a width to be draggable at all, which the preview gives it rather than the rail */
const BINDINGS = ['v-model="value"'];

const template = (tag) => `<template>
    <div class="card flex justify-center">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'Slider',
    groups: [
        {
            title: 'Behaviour',
            controls: ['min', 'max', 'orientation', { prop: 'step', min: 1 }, 'range']
        },
        {
            title: 'State',
            controls: ['invalid', 'disabled', 'unstyled']
        },
        {
            title: 'Identity',
            controls: ['name', 'tabindex', 'ariaLabelledby', 'ariaLabel']
        }
    ],
    snippet: {
        bindings: BINDINGS,
        build: ({ tag, props }) => {
            // a range slider binds both ends, a plain one binds the single position
            const initial = props.range ? '[20, 80]' : '50';

            return {
                options: `${template(tag)}

<script>
export default {
    data() {
        return {
            value: ${initial}
        };
    }
};
${closingScript}`,
                composition: `${template(tag)}

<script setup>
import { ref } from 'vue';

const value = ref(${initial});
${closingScript}`
            };
        }
    }
});
