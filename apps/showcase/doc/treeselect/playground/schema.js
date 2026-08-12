import { NODES } from '@/components/doc/playground/fixtures';
import { closingScript, serialize } from '@/components/doc/playground/serialize';
import { defineSchema } from '@/components/doc/playground/schema';

/* re-exported so the preview and the generated snippet are working from the very same data */
export { NODES };

/* the tree is the data, so it is bound rather than offered as a control */
const BINDINGS = ['v-model="selectedNode"', ':options="nodes"'];

const template = (tag) => `<template>
    <div class="card flex justify-center">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'TreeSelect',
    groups: [
        {
            title: 'Behaviour',
            controls: [
                'selectionMode',
                { prop: 'maxSelectedLabels', min: 1 },
                'metaKeySelection',
                'loadingMode',
                'filter',
                { prop: 'filterBy', when: (state) => state.filter },
                { prop: 'filterMode', when: (state) => state.filter },
                { prop: 'filterPlaceholder', when: (state) => state.filter },
                { prop: 'filterLocale', when: (state) => state.filter }
            ]
        },
        {
            title: 'Appearance',
            controls: ['showClear', 'scrollHeight', 'fluid', 'display', 'placeholder', 'size', 'variant', 'inputClass']
        },
        {
            title: 'State',
            controls: ['loading', 'invalid', 'disabled', 'unstyled']
        },
        {
            title: 'Icons',
            controls: ['clearIcon', 'loadingIcon']
        },
        {
            title: 'Messages',
            controls: [{ prop: 'selectedItemsLabel', when: (state) => state.maxSelectedLabels != null }, 'emptyMessage']
        },
        {
            title: 'Identity',
            controls: ['name', 'appendTo', 'tabindex', 'inputId', 'ariaLabelledby', 'ariaLabel']
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
            selectedNode: null,
            nodes: ${serialize(NODES, 12)}
        };
    }
};
${closingScript}`,
                composition: `${template(tag)}

<script setup>
import { ref } from 'vue';

const nodes = ${serialize(NODES, 0)};

const selectedNode = ref(null);
${closingScript}`
            };
        }
    }
});
