import { defineSchema } from '@/components/doc/playground/schema';

/*
 * Toolbar is three regions and nothing else: what it looks like is entirely what you put in `start`,
 * `center` and `end`. Those are the controls, and they decide markup rather than properties.
 */
const REGIONS = {
    start: `<template #start>
    <Button icon="pi pi-plus" class="mr-2" severity="secondary" text />
    <Button icon="pi pi-print" class="mr-2" severity="secondary" text />
    <Button icon="pi pi-upload" severity="secondary" text />
</template>`,
    center: `<template #center>
    <IconField>
        <InputIcon>
            <i class="pi pi-search" />
        </InputIcon>
        <InputText placeholder="Search" />
    </IconField>
</template>`,
    end: `<template #end>
    <Button label="Save" />
</template>`
};

export function children(child) {
    return Object.keys(REGIONS)
        .filter((region) => child[region])
        .map((region) => REGIONS[region])
        .join('\n\n');
}

const template = (tag) => `<template>
    <div class="card">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'Toolbar',
    groups: [
        {
            title: 'Regions',
            controls: [
                { prop: 'start', structure: true, control: 'boolean', default: true, label: 'Start' },
                { prop: 'center', structure: true, control: 'boolean', default: false, label: 'Center' },
                { prop: 'end', structure: true, control: 'boolean', default: true, label: 'End' }
            ]
        },
        {
            title: 'Identity',
            controls: ['ariaLabelledby', 'unstyled']
        }
    ],
    snippet: {
        children,
        /* both variants are the same file: a Toolbar holds no state, so there is nothing to declare either way */
        build: ({ tag }) => ({ options: template(tag), composition: template(tag) })
    }
});
