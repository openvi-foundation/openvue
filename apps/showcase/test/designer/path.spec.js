import { describe, expect, it } from 'vitest';
import { deletePath, findUnsafeKey, getPath, isSafeKey, isSafePath, setPath } from '../../service/designer/path';

describe('designer/path', () => {
    describe('key safety', () => {
        it('rejects the prototype-pollution keys', () => {
            expect(isSafeKey('__proto__')).toBe(false);
            expect(isSafeKey('constructor')).toBe(false);
            expect(isSafeKey('prototype')).toBe(false);
        });

        it('accepts ordinary token segments', () => {
            expect(isSafeKey('primary')).toBe(true);
            expect(isSafeKey('500')).toBe(true);
        });

        it('rejects empty and non-string keys', () => {
            expect(isSafeKey('')).toBe(false);
            expect(isSafeKey(null)).toBe(false);
            expect(isSafeKey(5)).toBe(false);
        });

        it('rejects a path when any segment is unsafe', () => {
            expect(isSafePath('semantic.__proto__.polluted')).toBe(false);
            expect(isSafePath('semantic.primary.color')).toBe(true);
        });
    });

    describe('getPath', () => {
        it('reads nested values', () => {
            expect(getPath({ a: { b: { c: 1 } } }, 'a.b.c')).toBe(1);
        });

        it('returns undefined for missing paths', () => {
            expect(getPath({ a: {} }, 'a.b.c')).toBeUndefined();
        });

        it('does not read inherited properties', () => {
            expect(getPath({}, 'toString')).toBeUndefined();
        });

        it('refuses unsafe paths', () => {
            expect(getPath({}, '__proto__')).toBeUndefined();
        });
    });

    describe('setPath', () => {
        it('creates intermediate objects', () => {
            const target = {};

            expect(setPath(target, 'a.b.c', 'value')).toBe(true);
            expect(target.a.b.c).toBe('value');
        });

        it('overwrites a non-object on the way down', () => {
            const target = { a: 'scalar' };

            setPath(target, 'a.b', 1);
            expect(target.a.b).toBe(1);
        });

        it('refuses to pollute Object.prototype', () => {
            const target = {};

            expect(setPath(target, '__proto__.polluted', 'yes')).toBe(false);
            expect(setPath(target, 'a.constructor.prototype.polluted', 'yes')).toBe(false);
            expect({}.polluted).toBeUndefined();
        });
    });

    describe('deletePath', () => {
        it('removes a leaf', () => {
            const target = { a: { b: 1, c: 2 } };

            expect(deletePath(target, 'a.b')).toBe(true);
            expect(target.a).toEqual({ c: 2 });
        });

        it('reports false when nothing was removed', () => {
            expect(deletePath({ a: {} }, 'a.b')).toBe(false);
        });

        it('refuses unsafe paths', () => {
            expect(deletePath({}, '__proto__')).toBe(false);
        });
    });

    describe('findUnsafeKey', () => {
        it('finds a polluting key nested in an object graph', () => {
            const parsed = JSON.parse('{"preset":{"semantic":{"__proto__":{"x":1}}}}');

            expect(findUnsafeKey(parsed)).toBe('__proto__');
        });

        it('finds a polluting key inside an array', () => {
            const parsed = JSON.parse('{"list":[{"constructor":{}}]}');

            expect(findUnsafeKey(parsed)).toBe('constructor');
        });

        it('returns null for a clean graph', () => {
            expect(findUnsafeKey({ a: { b: [1, 2, { c: 'ok' }] } })).toBeNull();
        });
    });
});
