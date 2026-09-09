import { describe, expect, it } from 'vitest';
import Aura from '@openvue/themes/aura';
import { applyMissingTokens, findMissingTokens } from '../../service/designer/compat';
import { toFileName, toPresetSource, toThemeJson } from '../../service/designer/codegen';
import { createDocument } from '../../service/designer/document';
import { deepDiff } from '../../service/designer/diff';
import { importThemeJson } from '../../service/designer/importer';
import { setPath } from '../../service/designer/path';
import { decodeShare, encodeShare } from '../../service/designer/share';
import { validatePreset } from '../../service/designer/validate';

/**
 * Exercises the whole pipeline against the real Aura preset rather than a fixture, which is what
 * catches assumptions that only hold for toy data.
 *
 * @returns {object} a document with two realistic edits applied
 */
function editedDocument() {
    const doc = createDocument({ name: 'Round Trip', base: 'Aura', preset: Aura });

    setPath(doc.preset, 'semantic.colorScheme.light.primary.color', '{blue.500}');
    setPath(doc.preset, 'components.button.root.borderRadius', '0px');

    return doc;
}

describe('designer round trip (real Aura preset)', () => {
    it('validates a real preset with no blocking problems', () => {
        const result = validatePreset(editedDocument().preset);

        expect(result.errorCount).toBe(0);
        expect(result.canExport).toBe(true);
    });

    it('diffs to a fraction of the full preset', () => {
        const doc = editedDocument();
        const diff = deepDiff(Aura, doc.preset);
        const fullSize = JSON.stringify(doc.preset).length;
        const diffSize = JSON.stringify(diff).length;

        expect(diffSize).toBeLessThan(fullSize / 100);
        expect(diff).toEqual({
            semantic: { colorScheme: { light: { primary: { color: '{blue.500}' } } } },
            components: { button: { root: { borderRadius: '0px' } } }
        });
    });

    it('generates a TypeScript preset naming the right base and type', () => {
        const doc = editedDocument();
        const source = toPresetSource(doc, { mode: 'diff', language: 'ts', basePreset: Aura });

        expect(toFileName(doc, 'ts')).toBe('round-trip.preset.ts');
        expect(source).toContain("import Aura from '@openvue/themes/aura';");
        expect(source).toContain("import type { Preset } from '@openvue/themes';");
        expect(source).toContain('satisfies Preset');
        expect(source).toContain('definePreset(Aura, overrides)');
    });

    it('survives a JSON export and re-import as a new project', () => {
        const doc = editedDocument();
        const result = importThemeJson(toThemeJson(doc, '0.7.0-beta.0'));

        expect(result.ok).toBe(true);
        expect(result.document.preset).toEqual(doc.preset);
        expect(result.document.name).toBe(doc.name);
        expect(result.document.base).toBe('Aura');
        expect(result.document.id).not.toBe(doc.id);
    });

    it('survives a share-link round trip carrying only the diff', async () => {
        const doc = editedDocument();
        const diff = deepDiff(Aura, doc.preset);
        const token = await encodeShare({ name: doc.name, base: doc.base, diff, config: doc.config });
        const decoded = await decodeShare(token);

        expect(decoded.ok).toBe(true);
        expect(decoded.payload.diff).toEqual(diff);
        // Comfortably inside what browsers and chat clients accept in a URL.
        expect(token.length).toBeLessThan(2000);
    });

    it('migrates a stale theme without disturbing customised values', () => {
        const doc = editedDocument();
        const stale = structuredClone(doc.preset);

        delete stale.components.button.root.gap;
        delete stale.semantic.formField.paddingX;

        const missing = findMissingTokens(Aura, stale);

        expect(missing.map((entry) => entry.value)).toEqual(expect.arrayContaining(['components.button.root.gap', 'semantic.formField.paddingX']));

        const { preset, added } = applyMissingTokens(Aura, stale);

        expect(added).toEqual(expect.arrayContaining(['components.button.root.gap', 'semantic.formField.paddingX']));
        expect(preset.components.button.root.borderRadius).toBe('0px');
        expect(preset.semantic.colorScheme.light.primary.color).toBe('{blue.500}');
        expect(findMissingTokens(Aura, preset)).toEqual([]);
    });
});
