import { defineSchema } from '@/components/doc/playground/schema';

/*
 * A Divider is either a rule or a rule with something written in the middle of it, and which one it
 * is decides whether `align` means anything at all. The text is markup rather than a property, so
 * it is a structure control: empty leaves the tag self-closing, exactly as it would be written.
 */
const content = (child) => child.content || undefined;

/*
 * A vertical divider only reads as one between things standing side by side, so the surrounding
 * markup follows the layout the way it would in a real page.
 */
const template = (tag, props) =>
    props.layout === 'vertical'
        ? `<template>
    <div class="card flex">
        <div class="flex-1">${'Left'}</div>
        ${tag}
        <div class="flex-1">${'Right'}</div>
    </div>
</template>`
        : `<template>
    <div class="card">
        <p>Above</p>
        ${tag}
        <p>Below</p>
    </div>
</template>`;

export default defineSchema({
    component: 'Divider',
    groups: [
        {
            title: 'Content',
            controls: [
                { prop: 'content', structure: true, control: 'text', default: '', label: 'Text' },
                /* alignment is where the text sits along the rule, so it says nothing without any */
                { prop: 'align', when: (state) => state.content }
            ]
        },
        {
            title: 'Appearance',
            controls: ['layout', 'type', 'unstyled']
        }
    ],
    snippet: {
        children: content,
        build: ({ tag, props }) => ({ options: template(tag, props), composition: template(tag, props) })
    }
});
