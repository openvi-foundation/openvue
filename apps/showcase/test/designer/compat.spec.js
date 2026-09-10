import { describe, expect, it } from 'vitest';
import { applyMissingTokens, findMissingTokens } from '../../service/designer/compat';

describe('designer/compat', () => {
    it('reports nothing when the theme is up to date', () => {
        const base = { semantic: { primary: { color: 'green' } } };

        expect(findMissingTokens(base, structuredClone(base))).toEqual([]);
    });

    it('finds tokens added to the base since the theme was made', () => {
        const base = { semantic: { primary: { color: 'green', contrastColor: 'white' } } };
        const theme = { semantic: { primary: { color: 'red' } } };

        const missing = findMissingTokens(base, theme);

        expect(missing).toHaveLength(1);
        expect(missing[0].value).toBe('semantic.primary.contrastColor');
        expect(missing[0].defaultValue).toBe('white');
    });

    it('classifies tokens by namespace for display', () => {
        const base = { primitive: { blue: { 500: '#00f' } }, semantic: { x: 1 }, components: { button: { root: { y: 2 } } } };
        const types = findMissingTokens(base, {}).map((entry) => entry.type);

        expect(types).toEqual(['primitive', 'semantic', 'component']);
    });

    it('adds missing tokens without touching customized values', () => {
        const base = { semantic: { primary: { color: 'green', contrastColor: 'white' } } };
        const theme = { semantic: { primary: { color: 'red' } } };

        const { preset, added } = applyMissingTokens(base, theme);

        expect(preset.semantic.primary.color).toBe('red');
        expect(preset.semantic.primary.contrastColor).toBe('white');
        expect(added).toEqual(['semantic.primary.contrastColor']);
    });

    it('does not mutate the theme it was given', () => {
        const base = { semantic: { a: 1, b: 2 } };
        const theme = { semantic: { a: 9 } };

        applyMissingTokens(base, theme);

        expect(theme.semantic.b).toBeUndefined();
    });

    it('leaves the theme clean on a second run', () => {
        const base = { semantic: { a: 1, b: 2 } };
        const first = applyMissingTokens(base, { semantic: { a: 9 } });
        const second = applyMissingTokens(base, first.preset);

        expect(second.added).toEqual([]);
        expect(findMissingTokens(base, first.preset)).toEqual([]);
    });
});
