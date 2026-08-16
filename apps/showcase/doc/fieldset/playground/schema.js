import { PROSE } from '@/components/doc/playground/fixtures';
import { defineSchema } from '@/components/doc/playground/schema';

export const CHILDREN = `<p class="m-0">${PROSE[0]}</p>`;

const template = (tag) => `<template>
    <div class="card">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'Fieldset',
    groups: [
        {
            title: 'Content',
            /* a fieldset without a legend is a bordered box, which is the one thing a Fieldset is not */
            controls: [{ prop: 'legend', seed: 'Legend' }]
        },
        {
            title: 'Behaviour',
            controls: ['toggleable', { prop: 'collapsed', when: (state) => state.toggleable }]
        },
        {
            title: 'Appearance',
            controls: ['unstyled']
        }
    ],
    snippet: {
        children: CHILDREN,
        /* both variants are the same file: a Fieldset holds no state, so there is nothing to declare either way */
        build: ({ tag }) => ({ options: template(tag), composition: template(tag) })
    }
});
