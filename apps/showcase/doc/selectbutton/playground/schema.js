import { MODES } from '@/components/doc/playground/fixtures';
import { closingScript, serialize } from '@/components/doc/playground/serialize';
import { defineSchema } from '@/components/doc/playground/schema';

/* re-exported so the preview and the generated snippet are working from the very same data */
export { MODES };

/* the options are what there is to choose between, so they are bound rather than offered as a control */
const BINDINGS = ['v-model="mode"', ':options="modes"'];

const template = (tag) => `<template>
    <div class="card flex justify-center">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'SelectButton',
    groups: [
        {
            title: 'Behaviour',
            controls: ['multiple', 'allowEmpty']
        },
        {
            title: 'Appearance',
            controls: ['fluid', 'size']
        },
        {
            title: 'State',
            controls: ['invalid', 'disabled', 'unstyled']
        },
        {
            title: 'Identity',
            controls: ['name', 'dataKey', 'ariaLabelledby']
        }
    ],
    snippet: {
        bindings: BINDINGS,
        build: ({ tag, props }) => {
            // multiple picks bind an array, a single pick binds the chosen option
            const initial = props.multiple ? '[]' : 'null';

            return {
                options: `${template(tag)}

<script>
export default {
    data() {
        return {
            mode: ${initial},
            modes: ${serialize(MODES, 12)}
        };
    }
};
${closingScript}`,
                composition: `${template(tag)}

<script setup>
import { ref } from 'vue';

const modes = ${serialize(MODES, 0)};

const mode = ref(${initial});
${closingScript}`
            };
        }
    }
});
