import { describe, expect, it } from 'vitest';
import { buildCode } from './codegen';
import { activeProps, createState } from './schema';

/*
 * Every playground schema in the site, found rather than listed, so a new one is covered the moment
 * it exists. A schema is not hand-written data: labels, types and defaults are read out of the
 * generated apidoc, so regenerating that bundle can silently drop a control the schema still asks
 * for. These assertions are what turn that into a failed run.
 */
const schemas = import.meta.glob('@/doc/**/playground/schema.js', { eager: true, import: 'default' });

const entries = Object.entries(schemas);

it('finds the playground schemas', () => {
    expect(entries.length).toBeGreaterThan(0);
});

describe.each(entries)('%s', (_path, schema) => {
    it('resolves every control it asks for', () => {
        expect(schema.warnings).toEqual([]);
    });

    it('has no empty groups', () => {
        for (const group of schema.groups) {
            expect(group.title, `group "${group.title}"`).toBeTruthy();
            expect(group.controls.length, `group "${group.title}" has no controls`).toBeGreaterThan(0);
        }
    });

    it('gives every control a kind, a label and a default', () => {
        for (const group of schema.groups) {
            for (const control of group.controls) {
                expect(['boolean', 'number', 'select', 'text'], `${control.prop}`).toContain(control.control);
                expect(control.label, `${control.prop} label`).toBeTruthy();
                expect(control, `${control.prop} default`).toHaveProperty('default');

                // a select whose options are empty leaves a control that cannot be used
                if (control.control === 'select') expect(control.options?.length, `${control.prop} options`).toBeGreaterThan(0);
            }
        }
    });

    it('names each prop once across all groups', () => {
        const props = schema.groups.flatMap((group) => group.controls.map((control) => control.prop));

        expect(props.length).toBe(new Set(props).size);
    });

    /*
     * The state a playground opens on generates nothing, because a playground that writes props on
     * open is telling the visitor they changed something they did not. The exception is a seeded
     * prop, which is a value the schema deliberately starts from and so belongs in the code.
     */
    it('generates only what it seeds', () => {
        const seeded = schema.groups.flatMap((group) => group.controls.filter((control) => control.seed !== undefined).map((control) => control.prop));

        expect(Object.keys(activeProps(schema, createState(schema))).sort()).toEqual(seeded.sort());
    });

    it('builds code for every variant', () => {
        const code = buildCode({ schema, props: activeProps(schema, createState(schema)) });

        for (const variant of ['basic', 'composition', 'options']) {
            expect(code[variant], variant).toBeTruthy();
            // the blank line top and bottom is what gives a rendered code block its padding
            expect(code[variant].startsWith('\n'), `${variant} starts blank`).toBe(true);
            expect(code[variant].endsWith('\n'), `${variant} ends blank`).toBe(true);
        }

        expect(code.composition).toContain(schema.component);
    });
});
