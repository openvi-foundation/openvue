import { describe, expect, it } from 'vitest';
import { reactive } from 'vue';
import { applyMissingTokens } from '../../service/designer/compat';
import { toThemeJson } from '../../service/designer/codegen';
import { deepMergeMissing } from '../../service/designer/diff';
import { clonePlain, cloneDocument, createDocument } from '../../service/designer/document';
import { saveTheme, listThemes, resetForTests } from '../../service/designer/storage';

/**
 * The live theme lives in `$appState`, so everything the designer hands to these modules is a Vue
 * reactive proxy. `structuredClone` throws DataCloneError on a proxy, which previously meant no
 * edit ever applied or saved. These tests reproduce that shape directly.
 *
 * @returns {object} a reactive document, exactly as the components pass it
 */
function reactiveDocument() {
    return reactive(
        createDocument({
            name: 'Reactive',
            base: 'Aura',
            preset: {
                primitive: { green: { 500: '#22c55e' } },
                semantic: { primary: { color: '{green.500}' } },
                components: { button: { root: { borderRadius: '6px' } } }
            }
        })
    );
}

describe('designer modules accept Vue reactive proxies', () => {
    it('clonePlain strips reactivity instead of throwing', () => {
        const doc = reactiveDocument();

        expect(() => clonePlain(doc)).not.toThrow();
        expect(() => structuredClone(doc)).toThrow();

        const plain = clonePlain(doc);

        expect(plain.preset.semantic.primary.color).toBe('{green.500}');
    });

    it('cloneDocument duplicates a reactive document', () => {
        const doc = reactiveDocument();

        expect(() => cloneDocument(doc)).not.toThrow();
        expect(cloneDocument(doc).id).not.toBe(doc.id);
    });

    it('applyMissingTokens accepts a reactive preset', () => {
        const doc = reactiveDocument();
        const base = { primitive: { green: { 500: '#22c55e' } }, semantic: { primary: { color: '#000', contrastColor: '#fff' } } };

        expect(() => applyMissingTokens(base, doc.preset)).not.toThrow();

        const { preset, added } = applyMissingTokens(base, doc.preset);

        expect(added).toContain('semantic.primary.contrastColor');
        expect(preset.semantic.primary.color).toBe('{green.500}');
    });

    it('deepMergeMissing accepts a reactive source', () => {
        const source = reactive({ a: { b: 1 } });
        const target = {};

        expect(() => deepMergeMissing(target, source)).not.toThrow();
        expect(target.a.b).toBe(1);
    });

    it('storage persists a reactive document', () => {
        resetForTests();

        const doc = reactiveDocument();

        expect(() => saveTheme(clonePlain(doc))).not.toThrow();
        expect(listThemes()).toHaveLength(1);
    });

    it('JSON export works from a reactive document', () => {
        const doc = reactiveDocument();

        expect(() => toThemeJson(doc, '0.0.0')).not.toThrow();
        expect(JSON.parse(toThemeJson(doc, '0.0.0')).preset.semantic.primary.color).toBe('{green.500}');
    });
});
