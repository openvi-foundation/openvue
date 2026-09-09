import { describe, expect, it } from 'vitest';
import { MAX_IMPORT_BYTES, importThemeJson, importThemeObject } from '../../service/designer/importer';
import { SCHEMA_VERSION, THEME_FORMAT } from '../../service/designer/document';

/**
 * @param {object} [overrides]
 * @returns {object} a minimal well-formed export payload
 */
function validPayload(overrides = {}) {
    return {
        format: THEME_FORMAT,
        schemaVersion: SCHEMA_VERSION,
        name: 'My Theme',
        base: 'Aura',
        preset: { primitive: { green: { 500: '#22c55e' } }, semantic: { primary: { color: '{green.500}' } } },
        config: { font_size: '14px', font_family: 'Inter var' },
        ...overrides
    };
}

describe('designer/importer', () => {
    it('accepts a well-formed payload', () => {
        const result = importThemeObject(validPayload());

        expect(result.ok).toBe(true);
        expect(result.document.name).toBe('My Theme');
        expect(result.validation.canExport).toBe(true);
    });

    it('always mints a new local id so an import never collides with an existing project', () => {
        const first = importThemeObject(validPayload());
        const second = importThemeObject(validPayload());

        expect(first.document.id).not.toBe(second.document.id);
    });

    it('ignores any id or timestamps present in the file', () => {
        const result = importThemeObject(validPayload({ id: 'attacker-chosen', createdAt: 0 }));

        expect(result.document.id).not.toBe('attacker-chosen');
        expect(result.document.createdAt).toBeGreaterThan(0);
    });

    it('rejects a payload without the format discriminator', () => {
        const result = importThemeObject({ schemaVersion: 1, preset: {} });

        expect(result.ok).toBe(false);
        expect(result.code).toBe('unknown-format');
    });

    it('rejects a schema version from the future', () => {
        const result = importThemeObject(validPayload({ schemaVersion: SCHEMA_VERSION + 1 }));

        expect(result.ok).toBe(false);
        expect(result.code).toBe('future-version');
    });

    it('rejects a non-object preset', () => {
        expect(importThemeObject(validPayload({ preset: 'nope' })).code).toBe('invalid-preset');
        expect(importThemeObject(validPayload({ preset: [1, 2] })).code).toBe('invalid-preset');
    });

    it('rejects arrays and primitives at the top level', () => {
        expect(importThemeObject([]).code).toBe('not-an-object');
        expect(importThemeObject(null).code).toBe('not-an-object');
    });

    it('rejects a payload carrying a prototype-polluting key', () => {
        const text = JSON.stringify(validPayload()).replace('"preset":{', '"preset":{"__proto__":{"bad":true},');
        const result = importThemeJson(text);

        expect(result.ok).toBe(false);
        expect(result.code).toBe('unsafe-key');
        expect({}.bad).toBeUndefined();
    });

    it('rejects input above the size cap', () => {
        const payload = validPayload();

        payload.preset.filler = 'x'.repeat(MAX_IMPORT_BYTES);

        const result = importThemeJson(JSON.stringify(payload));

        expect(result.ok).toBe(false);
        expect(result.code).toBe('too-large');
    });

    it('rejects malformed JSON', () => {
        expect(importThemeJson('{ not json').code).toBe('invalid-json');
    });

    it('rejects empty input', () => {
        expect(importThemeJson('   ').code).toBe('empty');
        expect(importThemeJson(null).code).toBe('empty');
    });

    it('surfaces validation problems without refusing the import', () => {
        const payload = validPayload();

        payload.preset.semantic.primary.color = '{does.not.exist}';

        const result = importThemeObject(payload);

        expect(result.ok).toBe(true);
        expect(result.validation.canExport).toBe(false);
    });
});
