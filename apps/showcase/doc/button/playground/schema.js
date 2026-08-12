import { defineSchema } from '@/components/doc/playground/schema';

/* nothing is bound: every part of a button, its label included, is a property the rail owns */
const BINDINGS = [];

const template = (tag) => `<template>
    <div class="card flex justify-center">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'Button',
    groups: [
        {
            title: 'Behaviour',
            controls: [
                { prop: 'iconPos', when: (state) => state.icon },
                { prop: 'iconClass', when: (state) => state.icon },
                { prop: 'badgeClass', when: (state) => state.badge },
                { prop: 'badgeSeverity', when: (state) => state.badge },
                'asChild',
                'link',
                'severity',
                'raised',
                'rounded',
                'text',
                'outlined',
                'plain',
                'type',
                'autofocus'
            ]
        },
        {
            title: 'Appearance',
            controls: [{ prop: 'label', seed: 'Submit' }, 'badge', 'size', 'variant', 'fluid']
        },
        {
            title: 'State',
            controls: ['loading', 'unstyled', 'disabled']
        },
        {
            title: 'Icons',
            controls: ['icon', { prop: 'loadingIcon', when: (state) => state.loading }]
        }
    ],
    snippet: {
        bindings: BINDINGS,
        /* both variants are the same file: a button holds no value, so there is nothing to declare either way */
        build: ({ tag }) => ({ options: template(tag), composition: template(tag) })
    }
});
