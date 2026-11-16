import { describe, expect, it } from 'vitest';
import { definePreset } from '@openvue/themes';
import Aura from '@openvue/themes/aura';
import Lara from '@openvue/themes/lara';
import Material from '@openvue/themes/material';
import Nide from '@openvue/themes/nide';
import Nora from '@openvue/themes/nora';
import { validatePreset } from '../../service/designer/validate';
import { BASES, FONTS, buildPresetExt, contrastRatio, isCustomColor } from '../../service/theme/compile';
import { DEFAULT_RECIPE, PRESETS, createRecipeHistory, decodeRecipe, encodeRecipe, findPreset, isSameRecipe, normalizeRecipe, presetRecipe } from '../../service/theme/recipe';

const BASE_PRESETS = { Aura, Lara, Material, Nora, Nide };

function compile(recipe) {
    const base = BASE_PRESETS[recipe.base];

    return { base, preset: definePreset(base, buildPresetExt(recipe, base)) };
}

function resolve(preset, mode, value) {
    const match = /^\{(primary|surface)\.(\d+)\}$/.exec(value);

    if (!match) return value.toLowerCase();

    const palette = match[1] === 'primary' ? preset.semantic.primary : preset.semantic.colorScheme[mode].surface;

    return palette[match[2]].toLowerCase();
}

function actionContrast(recipe) {
    const { preset } = compile(recipe);

    return Object.fromEntries(
        ['light', 'dark'].map((mode) => {
            const { color, contrastColor } = preset.semantic.colorScheme[mode].primary;

            return [mode, contrastRatio(resolve(preset, mode, color), resolve(preset, mode, contrastColor))];
        })
    );
}

describe('theme-builder/recipe', () => {
    describe('normalizeRecipe', () => {
        it('falls back to the default for every field it does not recognise', () => {
            expect(normalizeRecipe({ base: 'Bootstrap', primary: 'red; x', surface: 'mud', font: 'Comic Sans; x', radius: 7.5, scale: 40, density: 'tight', input: 'ghost' })).toEqual(DEFAULT_RECIPE);
            expect(normalizeRecipe(null)).toEqual(DEFAULT_RECIPE);
        });

        it('accepts a custom hex primary and lowercases it', () => {
            expect(normalizeRecipe({ primary: '#3B82F6' }).primary).toBe('#3b82f6');
            expect(normalizeRecipe({ primary: 'url(#x)' }).primary).toBe('noir');
        });

        it('accepts any Google Fonts family name but nothing that could break out of CSS', () => {
            expect(normalizeRecipe({ font: 'Lobster' }).font).toBe('Lobster');
            expect(normalizeRecipe({ font: 'Roboto"; color: red' }).font).toBe('Inter var');
        });

        it('keeps the radius to whole pixels from 0 to 16', () => {
            expect(normalizeRecipe({ radius: '0' }).radius).toBe(0);
            expect(normalizeRecipe({ radius: '16' }).radius).toBe(16);
            expect(normalizeRecipe({ radius: '17' }).radius).toBeNull();
            expect(normalizeRecipe({ radius: 'default' }).radius).toBeNull();
        });

        it('accepts the focus, motion, depth and ripple choices it knows', () => {
            const recipe = normalizeRecipe({ focus: 'bold', motion: 'off', shadow: 'flat', mask: 'dark', ripple: 'true', disabled: '0.45' });

            expect(recipe).toMatchObject({ focus: 'bold', motion: 'off', shadow: 'flat', mask: 'dark', ripple: true, disabled: 0.45 });
            expect(normalizeRecipe({ focus: 'glow', motion: 'warp', shadow: 'neon', mask: 'blur', ripple: 'yes' })).toEqual(DEFAULT_RECIPE);
        });

        it('keeps the disabled opacity between 30% and 80%', () => {
            expect(normalizeRecipe({ disabled: 0.3 }).disabled).toBe(0.3);
            expect(normalizeRecipe({ disabled: 0.8 }).disabled).toBe(0.8);
            expect(normalizeRecipe({ disabled: 0.1 }).disabled).toBeNull();
            expect(normalizeRecipe({ disabled: 'x' }).disabled).toBeNull();
            expect(normalizeRecipe({ disabled: 'default' }).disabled).toBeNull();
        });

        it('only reads known keys', () => {
            const recipe = normalizeRecipe(Object.fromEntries(new URLSearchParams('__proto__=x&constructor=y&base=Nora')));

            expect(recipe.base).toBe('Nora');
            expect(Object.keys(recipe)).toEqual(Object.keys(DEFAULT_RECIPE));
        });
    });

    describe('URL fragment', () => {
        it.each(PRESETS.map((preset) => [preset.name, preset]))('round-trips %s', (name, preset) => {
            expect(isSameRecipe(decodeRecipe('#' + encodeRecipe(presetRecipe(preset))), preset)).toBe(true);
        });

        it('writes only the base and what differs from the default', () => {
            expect(encodeRecipe(DEFAULT_RECIPE)).toBe('base=Aura');
            expect(encodeRecipe({ ...DEFAULT_RECIPE, base: 'Nora', ripple: true, disabled: 0.5 })).toBe('base=Nora&ripple=true&disabled=0.5');
        });

        it('ignores fragments that are not recipes, including designer share links', () => {
            expect(decodeRecipe('')).toBeNull();
            expect(decodeRecipe('#theme=v1.g.abc')).toBeNull();
        });
    });

    describe('presets', () => {
        it('are valid, distinct and described', () => {
            const names = PRESETS.map((preset) => preset.name);

            expect(new Set(names).size).toBe(names.length);

            for (const preset of PRESETS) {
                const recipe = presetRecipe(preset);

                expect(normalizeRecipe(recipe), preset.name).toEqual(recipe);
                expect(findPreset(recipe).name).toBe(preset.name);
                expect(preset.description.length, preset.name).toBeGreaterThan(20);
                expect(FONTS).toContain(preset.font);
            }
        });

        it('start with the documentation site theme and cover every base', () => {
            expect(isSameRecipe(PRESETS[0], DEFAULT_RECIPE)).toBe(true);
            expect(new Set(PRESETS.map((preset) => preset.base))).toEqual(new Set(BASES.map((base) => base.value)));
        });

        it.each(PRESETS.map((preset) => [preset.name, preset]))('%s compiles without unresolved references', (name, preset) => {
            const { base, preset: compiled } = compile(presetRecipe(preset));

            expect(validatePreset(compiled, base).issues.filter((issue) => issue.severity === 'error')).toEqual([]);
        });

        it.each(PRESETS.filter((preset) => isCustomColor(preset.primary)).map((preset) => [preset.name, preset]))('%s buttons pass WCAG AA in both colour schemes', (name, preset) => {
            const contrast = actionContrast(presetRecipe(preset));

            expect(contrast.light, 'light').toBeGreaterThanOrEqual(4.5);
            expect(contrast.dark, 'dark').toBeGreaterThanOrEqual(4.5);
        });
    });

    describe('accessible custom colours', () => {
        it.each(BASES.map((base) => [base.value]))('%s', (base) => {
            for (const primary of ['#38bdf8', '#facc15', '#1e1b4b', '#16a34a', '#e11d48']) {
                for (const surface of ['default', 'slate', 'ocean']) {
                    const contrast = actionContrast({ ...DEFAULT_RECIPE, base, primary, surface });

                    expect(contrast.light, `${primary} ${surface} light`).toBeGreaterThanOrEqual(4.5);
                    expect(contrast.dark, `${primary} ${surface} dark`).toBeGreaterThanOrEqual(4.5);
                }
            }
        });

        it('leaves a brand that already passes where it is', () => {
            expect(compile({ ...DEFAULT_RECIPE, primary: '#1d4ed8' }).preset.semantic.colorScheme.light.primary.color).toBe('{primary.500}');
        });

        it('keeps the base hover direction', () => {
            const shade = (reference) => Number(/\d+/.exec(reference)[0]);
            const material = compile({ ...DEFAULT_RECIPE, base: 'Material', primary: '#38bdf8' }).preset.semantic.colorScheme.light.primary;
            const aura = compile({ ...DEFAULT_RECIPE, primary: '#38bdf8' }).preset.semantic.colorScheme.light.primary;

            expect(shade(material.hoverColor)).toBeLessThan(shade(material.color));
            expect(shade(aura.hoverColor)).toBeGreaterThan(shade(aura.color));
        });
    });

    describe('createRecipeHistory', () => {
        it('undoes and redoes whole recipes', () => {
            const history = createRecipeHistory();
            const a = DEFAULT_RECIPE;
            const b = { ...a, base: 'Nora' };

            history.push(a, 0);
            history.push(b, 1000);

            expect(history.undo()).toEqual(a);
            expect(history.undo()).toBeNull();
            expect(history.redo()).toEqual(b);
        });

        it('collapses a quick run of changes to one setting into one step', () => {
            const history = createRecipeHistory();

            history.push(DEFAULT_RECIPE, 0);

            for (const [radius, at] of [
                [3, 1000],
                [5, 1050],
                [9, 1100]
            ]) {
                history.push({ ...DEFAULT_RECIPE, radius }, at);
            }

            expect(history.undo()).toEqual(DEFAULT_RECIPE);
            expect(history.redo().radius).toBe(9);
        });

        it('keeps separate steps for different settings or after a pause', () => {
            const history = createRecipeHistory();

            history.push(DEFAULT_RECIPE, 0);
            history.push({ ...DEFAULT_RECIPE, radius: 4 }, 1000);
            history.push({ ...DEFAULT_RECIPE, radius: 4, scale: 15 }, 1100);
            history.push({ ...DEFAULT_RECIPE, radius: 4, scale: 16 }, 5000);

            expect(history.undo().scale).toBe(15);
            expect(history.undo().scale).toBe(14);
            expect(history.undo().radius).toBeNull();
        });

        it('drops the redo branch on a new edit and keeps at most the limit', () => {
            const history = createRecipeHistory({ limit: 3 });

            for (const [scale, at] of [
                [12, 0],
                [13, 1000],
                [14, 2000],
                [15, 3000]
            ]) {
                history.push({ ...DEFAULT_RECIPE, scale }, at);
            }

            expect(history.undo().scale).toBe(14);
            history.push({ ...DEFAULT_RECIPE, scale: 16 }, 9000);
            expect(history.canRedo()).toBe(false);
            expect(history.undo().scale).toBe(14);
            expect(history.undo().scale).toBe(13);
            expect(history.undo()).toBeNull();
        });
    });
});
