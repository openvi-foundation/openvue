import { defineSchema } from '@/components/doc/playground/schema';

/**
 * A Splitter is the gutters between its panels, so how many panels there are is markup. `size` and
 * `minSize` are documented properties of SplitterPanel, which is where their typings are read from:
 * they are applied to the first panel, and the rest divide what is left.
 */
export function children({ panels, size, minSize }) {
    return Array.from({ length: panels }, (_, index) => {
        const first = index === 0;
        const attributes = [first && size ? ` :size="${size}"` : '', first && minSize ? ` :minSize="${minSize}"` : ''].join('');

        return `<SplitterPanel${attributes} class="flex items-center justify-center">Panel ${index + 1}</SplitterPanel>`;
    }).join('\n');
}

/*
 * A Splitter divides a height it is given, and has no property for one: without this the panels
 * collapse to nothing and there is no gutter worth dragging.
 */
const BINDINGS = ['style="height: 300px"'];

const template = (tag) => `<template>
    <div class="card">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'Splitter',
    groups: [
        {
            title: 'Structure',
            controls: [
                { prop: 'panels', structure: true, control: 'number', default: 2, min: 2, max: 4, label: 'Panels' },
                /* both are the first panel's share, which is what the others are then measured against */
                { prop: 'size', of: 'SplitterPanel', min: 0, max: 100, label: 'First panel size' },
                { prop: 'minSize', of: 'SplitterPanel', min: 0, max: 100, label: 'First panel min size' }
            ]
        },
        {
            title: 'Behaviour',
            controls: [{ prop: 'step', min: 1 }, 'layout']
        },
        {
            title: 'Appearance',
            controls: [{ prop: 'gutterSize', min: 1 }, 'unstyled']
        },
        {
            title: 'Storage',
            controls: ['stateKey', { prop: 'stateStorage', when: (state) => state.stateKey }]
        }
    ],
    snippet: {
        bindings: BINDINGS,
        children,
        /* both variants are the same file: a Splitter holds no state of its own unless it is asked to store one */
        build: ({ tag }) => ({ options: template(tag), composition: template(tag) })
    }
});
