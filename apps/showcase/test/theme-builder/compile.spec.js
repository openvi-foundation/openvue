import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { definePreset } from '@openvue/themes';
import Aura from '@openvue/themes/aura';
import Lara from '@openvue/themes/lara';
import Material from '@openvue/themes/material';
import Nide from '@openvue/themes/nide';
import Nora from '@openvue/themes/nora';
import AppConfigurator from '../../components/layout/AppConfigurator.vue';
import { BASES, PRIMARY_COLORS, RECIPE_COMPONENTS, SURFACES, buildPresetExt, primaryPalette, scaleRadius, scaleSpacing, swatchColor } from '../../service/theme/compile';
import { scopedThemeCss } from '../../service/theme/scope';

const PRESETS = { Aura, Lara, Material, Nora, Nide };
const PLAIN = { base: 'Aura', primary: 'noir', surface: 'default', radius: null, density: 1 };

describe('theme-studio/compile', () => {
    it('every named primary is a primitive palette of every base', () => {
        for (const [name, preset] of Object.entries(PRESETS)) {
            for (const color of PRIMARY_COLORS.filter((value) => value !== 'noir')) {
                expect(preset.primitive[color]?.[500], `${name} ${color}`).toMatch(/^#/);
            }
        }
    });

    describe('primaryPalette', () => {
        it('references a named palette and follows the surface for noir', () => {
            expect(primaryPalette('indigo')[500]).toBe('{indigo.500}');
            expect(primaryPalette('noir')[950]).toBe('{surface.950}');
        });

        it('generates a full palette around a custom colour', () => {
            const generated = primaryPalette('#3b82f6');

            expect(Object.keys(generated)).toEqual(['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']);
            expect(generated[500]).toBe('#3b82f6');
        });
    });

    it('draws a swatch from the theme’s own palette, the text colour for noir, or the custom colour itself', () => {
        expect(swatchColor('indigo')).toBe('var(--p-indigo-500)');
        expect(swatchColor('noir')).toBe('var(--text-color)');
        expect(swatchColor('#be123c')).toBe('#be123c');
    });

    describe('focus, motion and depth', () => {
        it('add nothing while left at the base default', () => {
            const ext = buildPresetExt({ ...PLAIN, focus: 'default', motion: 'default', shadow: 'default', mask: 'default', disabled: null }, Aura);

            expect(ext.semantic.focusRing).toBeUndefined();
            expect(ext.semantic.transitionDuration).toBeUndefined();
            expect(ext.semantic.overlay).toBeUndefined();
            expect(ext.semantic.disabledOpacity).toBeUndefined();
            expect(ext.semantic.colorScheme.light.mask).toBeUndefined();
            expect(ext.components?.card).toBeUndefined();
        });

        it('draw a solid ring in the action colour, even on a base without one', () => {
            const ext = buildPresetExt({ ...PLAIN, base: 'Lara', focus: 'tight' }, Lara);

            expect(ext.semantic.focusRing).toEqual({ width: '2px', style: 'solid', color: '{primary.color}', offset: '0', shadow: 'none' });
        });

        // The engine writes colour scheme tokens last, so a base's own per-scheme ring would win.
        it('restate the parts of the ring a base sets per colour scheme, and only those', () => {
            const recipe = { ...PLAIN, focus: 'bold' };

            expect(buildPresetExt({ ...recipe, base: 'Nide' }, Nide).semantic.colorScheme.dark.focusRing).toEqual({ color: '{primary.color}' });
            expect(buildPresetExt({ ...recipe, base: 'Lara' }, Lara).semantic.colorScheme.light.focusRing).toEqual({ shadow: 'none' });
            expect(buildPresetExt({ ...recipe, base: 'Material' }, Material).semantic.colorScheme.dark.focusRing).toEqual({ shadow: 'none' });
            expect(buildPresetExt(recipe, Aura).semantic.colorScheme.light.focusRing).toBeUndefined();
            expect(buildPresetExt({ ...recipe, base: 'Nora' }, Nora).semantic.colorScheme.dark.focusRing).toBeUndefined();

            // Lara's buttons glow instead of drawing an outline; the others already colour their outline per severity.
            const laraButtons = buildPresetExt({ ...recipe, base: 'Lara' }, Lara).components.button.colorScheme;

            expect(laraButtons.light.root.danger.focusRing).toEqual({ color: '{focus.ring.color}', shadow: 'none' });
            expect(Object.keys(laraButtons.dark.root)).toEqual(Object.keys(Lara.components.button.colorScheme.dark.root));
            expect(buildPresetExt(recipe, Aura).components?.button?.colorScheme).toBeUndefined();
            expect(buildPresetExt({ ...recipe, base: 'Lara', focus: 'default' }, Lara).components?.button).toBeUndefined();

            for (const [name, base] of Object.entries(PRESETS)) {
                const css = scopedThemeCss(definePreset(base, buildPresetExt({ ...recipe, base: name }, base)), '.x', { components: [], css: false });

                for (const block of css.split('\n')) {
                    const last = (property) => [...block.matchAll(new RegExp(`--p-focus-ring-${property}:([^;]*);`, 'g'))].pop()?.[1];

                    expect([undefined, 'var(--p-primary-color)'], `${name} colour`).toContain(last('color'));
                    expect([undefined, 'none'], `${name} shadow`).toContain(last('shadow'));
                }
            }
        });

        // Nide's fields draw the focus ring in its colour at a width of their own, which would stay 3px.
        it('give fields that draw the focus ring the chosen width and offset', () => {
            const recipe = { ...PLAIN, focus: 'hairline' };

            expect(buildPresetExt({ ...recipe, base: 'Nide' }, Nide).semantic.formField.focusRing).toEqual({ width: '1px', offset: '2px' });
            expect(definePreset(Nide, buildPresetExt({ ...recipe, base: 'Nide' }, Nide)).semantic.formField.focusRing).toMatchObject({ width: '1px', offset: '2px', color: '{focus.ring.color}', shadow: '{form.field.shadow}' });

            // Lara's already follow through references; Material's and Nora's are their own, Aura's fields have none.
            for (const [name, base] of Object.entries({ Aura, Lara, Material, Nora })) {
                expect(buildPresetExt({ ...recipe, base: name }, base).semantic.formField?.focusRing, name).toBeUndefined();
            }

            expect(buildPresetExt({ ...PLAIN, base: 'Nide', focus: 'default' }, Nide).semantic.formField).toBeUndefined();
        });

        it('set the transition duration and the disabled opacity', () => {
            const ext = buildPresetExt({ ...PLAIN, motion: 'off', disabled: 0.45 }, Aura);

            expect(ext.semantic.transitionDuration).toBe('0s');
            expect(ext.semantic.disabledOpacity).toBe('0.45');
        });

        it('set every overlay and card shadow, and border flat overlays so they still stand out', () => {
            const deep = buildPresetExt({ ...PLAIN, shadow: 'deep' }, Aura);
            const flat = buildPresetExt({ ...PLAIN, base: 'Material', shadow: 'flat' }, Material);

            expect(Object.keys(deep.semantic.overlay)).toEqual(['select', 'popover', 'navigation', 'modal']);
            expect(deep.components.card.root.shadow).toContain('rgba');
            expect(deep.semantic.colorScheme.light.overlay).toBeUndefined();
            expect(flat.semantic.overlay.modal.shadow).toBe('none');
            expect(flat.semantic.colorScheme.dark.overlay.popover.borderColor).toBe('{content.border.color}');
        });

        it('darken or lighten the backdrop per colour scheme', () => {
            const ext = buildPresetExt({ ...PLAIN, mask: 'light' }, Aura);

            expect(ext.semantic.colorScheme.light.mask.background).toBe('rgba(0, 0, 0, 0.2)');
            expect(ext.semantic.colorScheme.dark.mask.background).toBe('rgba(0, 0, 0, 0.4)');
        });

        it('only touch component tokens of the components the live stylesheet carries', () => {
            const ext = buildPresetExt({ ...PLAIN, density: 'compact', shadow: 'soft' }, Aura);

            expect(Object.keys(ext.components).every((name) => RECIPE_COMPONENTS.includes(name))).toBe(true);
        });
    });

    describe('scaleRadius', () => {
        it('moves md to the target and keeps the proportions', () => {
            expect(scaleRadius(Aura.primitive.borderRadius, 12)).toEqual({ none: '0', xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px' });
        });

        it('squares everything at zero', () => {
            expect(Object.values(scaleRadius(Nide.primitive.borderRadius, 0))).toEqual(['0', '0', '0', '0', '0', '0']);
        });
    });

    describe('scaleSpacing', () => {
        it('scales every length and leaves the rest alone', () => {
            expect(scaleSpacing('0.5rem 0.75rem', 0.75)).toBe('0.375rem 0.5625rem');
            expect(scaleSpacing('7px', 1.25)).toBe('9px');
            expect(scaleSpacing('0 auto', 2)).toBe('0 auto');
        });
    });

    describe('buildPresetExt', () => {
        it('emits only what the choices change', () => {
            const ext = buildPresetExt(PLAIN, Aura);

            expect(Object.keys(ext)).toEqual(['semantic']);
            expect(ext.semantic.colorScheme.light.surface).toBeUndefined();
        });

        it('applies a named surface to both colour schemes', () => {
            const ext = buildPresetExt({ ...PLAIN, surface: 'stone' }, Aura);

            expect(ext.semantic.colorScheme.light.surface).toEqual(SURFACES.stone);
            expect(ext.semantic.colorScheme.dark.surface).toEqual(SURFACES.stone);
        });

        it('accepts a numeric density as well as a named one', () => {
            expect(buildPresetExt({ ...PLAIN, density: 0.75 }, Aura)).toEqual(buildPresetExt({ ...PLAIN, density: 'compact' }, Aura));
        });

        it('scales fields and buttons together so they keep the same height', () => {
            const aura = buildPresetExt({ ...PLAIN, density: 0.75 }, Aura);
            const nide = buildPresetExt({ ...PLAIN, base: 'Nide', density: 0.75 }, Nide);

            expect(aura.semantic.formField.paddingY).toBe(scaleSpacing(Aura.semantic.formField.paddingY, 0.75));
            // Aura's button padding references the field padding, so it follows on its own.
            expect(Aura.components.button.root.paddingY).toBe('{form.field.padding.y}');
            expect(aura.components.button.root.paddingY).toBeUndefined();
            // Nide sets its own horizontal button padding, which is scaled directly.
            expect(nide.components.button.root.paddingX).toBe(scaleSpacing(Nide.components.button.root.paddingX, 0.75));
        });

        it('keeps icon-only buttons square', () => {
            // Aura: 0.5rem vertical field padding, 2.5rem icon-only width.
            expect(buildPresetExt({ ...PLAIN, density: 0.75 }, Aura).components.button.root.iconOnlyWidth).toBe('2.25rem');
            expect(buildPresetExt({ ...PLAIN, density: 1.25 }, Aura).components.button.root.iconOnlyWidth).toBe('2.75rem');
        });

        it('skips spacing that is a reference', () => {
            const ext = buildPresetExt({ ...PLAIN, base: 'Nide', density: 1.25 }, Nide);

            expect(Nide.components.inputgroup.addon.padding).toContain('{');
            expect(ext.components?.inputgroup).toBeUndefined();
        });
    });

    describe('parity with the documentation configurator', () => {
        const originalDocument = globalThis.document;

        beforeAll(() => {
            globalThis.document = { documentElement: { style: { setProperty() {} } } };
        });

        afterAll(() => {
            globalThis.document = originalDocument;
        });

        function configuratorExt(base, primary) {
            const methods = AppConfigurator.methods;
            const context = {
                $appState: { preset: base },
                selectedPrimaryColor: primary,
                primaryColors: PRIMARY_COLORS.map((name) => ({ name, palette: name === 'noir' ? {} : PRESETS[base].primitive[name] }))
            };

            return methods.getPresetExt.call(context);
        }

        it.each(BASES.map((base) => [base.value]))('%s', (base) => {
            for (const primary of PRIMARY_COLORS) {
                const expected = configuratorExt(base, primary).semantic;
                const actual = buildPresetExt({ ...PLAIN, base, primary }, PRESETS[base]).semantic;

                expect(actual.colorScheme, `${base} ${primary}`).toEqual(expected.colorScheme);
                expect(actual.primary, `${base} ${primary}`).toEqual(expected.primary);
            }
        });
    });
});
