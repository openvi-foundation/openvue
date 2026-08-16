import { defineSchema } from '@/components/doc/playground/schema';

/*
 * Card documents exactly one property, `unstyled`, because a Card is not configured: it is composed.
 * Everything it does is decided by which of its five slots you fill, so those are the controls, and
 * they write markup rather than properties.
 */
export const BODY = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

export function children({ header, title, subtitle, footer }) {
    const slots = [];

    if (header) {
        slots.push(`<template #header>
    <div class="h-40 bg-surface-100 dark:bg-surface-800 flex items-center justify-center">Header</div>
</template>`);
    }

    if (title) slots.push(`<template #title>${title}</template>`);
    if (subtitle) slots.push(`<template #subtitle>${subtitle}</template>`);

    slots.push(`<template #content>
    <p class="m-0">${BODY}</p>
</template>`);

    if (footer) {
        slots.push(`<template #footer>
    <div class="flex gap-4">
        <Button label="Cancel" severity="secondary" outlined class="w-full" />
        <Button label="Save" class="w-full" />
    </div>
</template>`);
    }

    return slots.join('\n\n');
}

const template = (tag) => `<template>
    <div class="card flex justify-center">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'Card',
    groups: [
        {
            title: 'Sections',
            controls: [
                { prop: 'header', structure: true, control: 'boolean', default: false, label: 'Header' },
                { prop: 'title', structure: true, control: 'text', default: 'Advanced Card', label: 'Title' },
                { prop: 'subtitle', structure: true, control: 'text', default: '', label: 'Subtitle' },
                { prop: 'footer', structure: true, control: 'boolean', default: false, label: 'Footer' }
            ]
        },
        {
            title: 'Appearance',
            controls: ['unstyled']
        }
    ],
    snippet: {
        children,
        /* both variants are the same file: a Card holds no state, so there is nothing to declare either way */
        build: ({ tag }) => ({ options: template(tag), composition: template(tag) })
    }
});
