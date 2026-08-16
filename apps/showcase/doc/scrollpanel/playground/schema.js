import { PROSE } from '@/components/doc/playground/fixtures';
import { defineSchema } from '@/components/doc/playground/schema';

/*
 * A ScrollPanel is only itself once its content is taller than it is, so how much content there is
 * decides whether the component does anything at all. That is markup, not a property.
 */
export function children({ paragraphs }) {
    return Array.from({ length: paragraphs }, (_, index) => `<p>${PROSE[index % PROSE.length]}</p>`).join('\n');
}

/*
 * A height has to come from somewhere, and ScrollPanel has no property for one: left to itself it
 * grows to fit its content and never scrolls. It is bound rather than offered as a control so the
 * snippet works the moment it is pasted.
 */
const BINDINGS = ['style="width: 100%; height: 200px"'];

const template = (tag) => `<template>
    <div class="card">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'ScrollPanel',
    groups: [
        {
            title: 'Content',
            controls: [{ prop: 'paragraphs', structure: true, control: 'number', default: 4, min: 1, max: 12, label: 'Paragraphs' }]
        },
        {
            title: 'Behaviour',
            /* how far one press of an arrow key moves the bar */
            controls: [{ prop: 'step', min: 1 }]
        },
        {
            title: 'Appearance',
            controls: ['unstyled']
        }
    ],
    snippet: {
        bindings: BINDINGS,
        children,
        /* both variants are the same file: a ScrollPanel holds no state, so there is nothing to declare either way */
        build: ({ tag }) => ({ options: template(tag), composition: template(tag) })
    }
});
