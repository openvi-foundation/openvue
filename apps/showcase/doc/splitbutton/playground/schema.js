import { ACTIONS } from '@/components/doc/playground/fixtures';
import { closingScript, serialize } from '@/components/doc/playground/serialize';
import { defineSchema } from '@/components/doc/playground/schema';

/* re-exported so the preview and the generated snippet are working from the very same data */
export { ACTIONS };

/* the menu is the data behind the second half of the button, so it is bound rather than offered as a control */
const BINDINGS = [':model="items"'];

const template = (tag) => `<template>
    <div class="card flex justify-center">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'SplitButton',
    groups: [
        {
            title: 'Behaviour',
            controls: ['severity', 'raised', 'rounded', 'text', 'outlined', 'plain']
        },
        {
            title: 'Appearance',
            controls: [{ prop: 'label', seed: 'Save' }, 'fluid', 'size']
        },
        {
            title: 'State',
            controls: ['disabled', 'unstyled']
        },
        {
            title: 'Icons',
            controls: ['icon', 'menuButtonIcon', 'dropdownIcon']
        },
        {
            title: 'Identity',
            controls: ['autoZIndex', 'baseZIndex', 'appendTo']
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
            items: ${serialize(ACTIONS, 12)}
        };
    }
};
${closingScript}`,
                composition: `${template(tag)}

<script setup>
const items = ${serialize(ACTIONS, 0)};
${closingScript}`
            };
        }
    }
});
