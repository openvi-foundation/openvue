import { PROSE } from '@/components/doc/playground/fixtures';
import { defineSchema } from '@/components/doc/playground/schema';
import { closingScript } from '@/components/doc/playground/serialize';

/* the one thing it reports is the moment it decided to render, which is the whole behaviour */
const BINDINGS = ['@load="onLoad"'];

export const CHILDREN = `<p class="m-0">${PROSE[0]}</p>`;

/*
 * DeferredContent documents a single property, because it is not configured either: it renders its
 * content the first time that content is scrolled into view. The only thing worth changing is how
 * far away it starts, so the control writes the filler above it rather than anything on the tag.
 */
const filler = (spacer) => Array.from({ length: spacer }, (_, index) => `        <p>${PROSE[index % PROSE.length]}</p>`).join('\n');

const template = (tag, spacer) => `<template>
    <div class="card h-64 overflow-auto">
${filler(spacer)}
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'DeferredContent',
    groups: [
        {
            title: 'Content',
            /* how far the visitor has to scroll before the component decides it is time */
            controls: [{ prop: 'spacer', structure: true, control: 'number', default: 3, min: 0, max: 10, label: 'Paragraphs above' }]
        },
        {
            title: 'Appearance',
            controls: ['unstyled']
        }
    ],
    snippet: {
        bindings: BINDINGS,
        children: CHILDREN,
        build: ({ tag, child }) => ({
            options: `${template(tag, child.spacer)}

<script>
export default {
    methods: {
        onLoad() {
            /* fires once, the first time the content is scrolled into view */
            console.log('loaded');
        }
    }
};
${closingScript}`,
            composition: `${template(tag, child.spacer)}

<script setup>
function onLoad() {
    /* fires once, the first time the content is scrolled into view */
    console.log('loaded');
}
${closingScript}`
        })
    }
});
