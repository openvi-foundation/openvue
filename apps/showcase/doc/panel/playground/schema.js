import { PROSE } from '@/components/doc/playground/fixtures';
import { defineSchema } from '@/components/doc/playground/schema';

export const CHILDREN = `<p class="m-0">${PROSE[0]}</p>`;

const template = (tag) => `<template>
    <div class="card">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'Panel',
    groups: [
        {
            title: 'Content',
            /* seeded because a panel with no header is a bordered box, which shows nothing about a Panel */
            controls: [{ prop: 'header', seed: 'Header' }]
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
        /* both variants are the same file: a Panel holds no state, so there is nothing to declare either way */
        build: ({ tag }) => ({ options: template(tag), composition: template(tag) })
    }
});
