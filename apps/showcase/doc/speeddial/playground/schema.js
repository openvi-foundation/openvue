import { ACTIONS } from '@/components/doc/playground/fixtures';
import { closingScript, serialize } from '@/components/doc/playground/serialize';
import { defineSchema } from '@/components/doc/playground/schema';

/* re-exported so the preview and the generated snippet are working from the very same data */
export { ACTIONS };

/*
 * The actions are the data the dial fans out, so they are bound rather than offered as a control.
 * The class goes with them: the items are positioned against the dial, so the dial has to be
 * positioned against something itself, and a snippet without it fans the items off the card.
 */
const BINDINGS = [':model="items"', 'class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"'];

/* the dial needs room on every side of itself, which is what the sized relative box is for */
const template = (tag) => `<template>
    <div class="card">
        <div class="relative h-80">
            ${tag}
        </div>
    </div>
</template>`;

export default defineSchema({
    component: 'SpeedDial',
    groups: [
        {
            title: 'Behaviour',
            controls: [
                'visible',
                'direction',
                { prop: 'transitionDelay', min: 0 },
                'type',
                { prop: 'radius', when: (state) => state.type !== 'linear', min: 0 },
                'mask',
                'hideOnClickOutside',
                { prop: 'maskClass', when: (state) => state.mask },
                'rotateAnimation'
            ]
        },
        {
            title: 'State',
            controls: ['disabled', 'unstyled']
        },
        {
            title: 'Icons',
            controls: ['showIcon', 'hideIcon']
        },
        {
            title: 'Identity',
            controls: ['ariaLabel', 'ariaLabelledby']
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
