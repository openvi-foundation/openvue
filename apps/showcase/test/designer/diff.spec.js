import { describe, expect, it } from 'vitest';
import { deepDiff, deepMergeMissing, flattenLeaves, isEqual } from '../../service/designer/diff';

describe('designer/diff', () => {
    describe('deepDiff', () => {
        it('returns an empty object for identical inputs', () => {
            const preset = { semantic: { primary: { color: '{green.500}' } } };

            expect(deepDiff(preset, structuredClone(preset))).toEqual({});
        });

        it('emits only the changed leaf, not its siblings', () => {
            const base = { semantic: { primary: { color: '{green.500}', contrastColor: '#fff' } } };
            const current = structuredClone(base);

            current.semantic.primary.color = '{blue.500}';

            expect(deepDiff(base, current)).toEqual({ semantic: { primary: { color: '{blue.500}' } } });
        });

        it('includes keys the base does not have', () => {
            expect(deepDiff({ a: 1 }, { a: 1, b: 2 })).toEqual({ b: 2 });
        });

        it('treats arrays as leaves', () => {
            expect(deepDiff({ a: [1, 2] }, { a: [1, 3] })).toEqual({ a: [1, 3] });
            expect(deepDiff({ a: [1, 2] }, { a: [1, 2] })).toEqual({});
        });

        it('does not carry unsafe keys through', () => {
            const current = JSON.parse('{"a":1,"__proto__":{"bad":true}}');

            expect(Object.keys(deepDiff({ a: 1 }, current))).not.toContain('__proto__');
        });

        it('is minimal on a deep realistic shape', () => {
            const base = { components: { button: { root: { borderRadius: '6px', paddingX: '1rem' } }, card: { root: { padding: '1rem' } } } };
            const current = structuredClone(base);

            current.components.button.root.borderRadius = '0px';

            const diff = deepDiff(base, current);

            expect(diff).toEqual({ components: { button: { root: { borderRadius: '0px' } } } });
            expect(diff.components.card).toBeUndefined();
        });
    });

    describe('isEqual', () => {
        it('compares nested structures by value', () => {
            expect(isEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })).toBe(true);
            expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
        });
    });

    describe('deepMergeMissing', () => {
        it('adds missing paths and reports them', () => {
            const target = { semantic: { primary: { color: 'red' } } };
            const source = { semantic: { primary: { color: 'green', contrastColor: 'white' } }, primitive: { blue: { 500: '#00f' } } };

            const added = deepMergeMissing(target, source);

            expect(added).toContain('semantic.primary.contrastColor');
            expect(added).toContain('primitive.blue.500');
            expect(added).not.toContain('semantic.primary.color');
        });

        it('never overwrites an existing value', () => {
            const target = { semantic: { primary: { color: 'red' } } };

            deepMergeMissing(target, { semantic: { primary: { color: 'green' } } });

            expect(target.semantic.primary.color).toBe('red');
        });

        it('deep clones added values so the source cannot be mutated through the target', () => {
            const source = { a: { b: { c: 1 } } };
            const target = {};

            deepMergeMissing(target, source);
            target.a.b.c = 99;

            expect(source.a.b.c).toBe(1);
        });
    });

    describe('flattenLeaves', () => {
        it('produces dot-paths for every leaf', () => {
            expect(flattenLeaves({ a: { b: 1 }, c: 2 })).toEqual([
                { path: 'a.b', value: 1 },
                { path: 'c', value: 2 }
            ]);
        });
    });
});
