import { describe, expect, it } from 'vitest';
import { transformWithEsbuild } from 'vite';
import { definePreset } from '@openvue/themes';
import Aura from '@openvue/themes/aura';
import Lara from '@openvue/themes/lara';
import Material from '@openvue/themes/material';
import Nora from '@openvue/themes/nora';
import { toPresetSource } from '../../service/designer/codegen';
import { createDocument } from '../../service/designer/document';
import { deepDiff, findRemovedPaths } from '../../service/designer/diff';
import { applySharedRemovals, decodeShare, encodeShare } from '../../service/designer/share';
import { importThemeJson } from '../../service/designer/importer';

const bases = { Aura, Lara, Material, Nora };

// Compile the complete module before evaluating its body with the real theme engine.
async function evaluateExport(doc, options = {}, marker = {}) {
    const source = toPresetSource(doc, { basePreset: bases[doc.base], ...options });
    const { code } = await transformWithEsbuild(source, 'theme.ts', { loader: 'ts', target: 'es2022', format: 'cjs' });
    const module = { exports: {} };
    const require = (id) => (id === '@openvue/themes' ? { definePreset } : { __esModule: true, default: bases[doc.base] });

    new Function('require', 'module', 'exports', 'marker', code)(require, module, module.exports, marker);

    return module.exports.default;
}

function documentWithTransfer(name = 'Transfer') {
    const doc = createDocument({ name, base: 'Aura', preset: Aura });

    doc.preset.components.button.root.primary = { background: '#123456' };
    delete doc.preset.components.button.colorScheme.light.root.primary.background;
    delete doc.preset.components.button.colorScheme.dark.root.primary.background;

    return doc;
}

describe('generated theme modules', () => {
    it.each(['ts', 'js'])('keeps imported metadata inert in %s exports', async (language) => {
        const doc = documentWithTransfer('*/\nmarker.hit = true;\n/*');

        doc.config = { font_family: '*/\rmarker.hit = true;/*', font_size: '*/\u2028marker.hit = true;/*' };
        const imported = importThemeJson(JSON.stringify(doc));
        const marker = {};

        expect(imported.ok).toBe(true);
        expect(await evaluateExport(imported.document, { language }, marker)).toEqual(doc.preset);
        expect(marker).toEqual({});
    });

    it.each(['Aura', 'Lara', 'Material', 'Nora', 'Preset', 'Reflect'])('supports a theme called %s', async (name) => {
        const base = bases[name] ? name : 'Aura';
        const doc = createDocument({ name, base, preset: bases[base] });

        expect(await evaluateExport(doc)).toEqual(doc.preset);
    });

    it.each(['diff', 'full'])('preserves token transfers in %s exports', async (mode) => {
        const before = structuredClone(Aura);
        const doc = documentWithTransfer();

        expect(await evaluateExport(doc, { mode })).toEqual(doc.preset);
        expect(Aura).toEqual(before);
    });

    it('round-trips carriage returns, quotes and backslashes in token values', async () => {
        const doc = documentWithTransfer();

        doc.preset.extend = { value: "a\r\nb\\c'd\u2028e\u2029f" };
        expect(await evaluateExport(doc)).toEqual(doc.preset);
    });

    it('preserves removals through share encoding and reconstruction', async () => {
        const doc = documentWithTransfer();
        const payload = { name: doc.name, base: doc.base, diff: deepDiff(Aura, doc.preset), removed: findRemovedPaths(Aura, doc.preset) };
        const decoded = await decodeShare(await encodeShare(payload));

        expect(decoded.ok).toBe(true);
        expect(applySharedRemovals(definePreset(Aura, decoded.payload.diff), decoded.payload.removed)).toEqual(doc.preset);
        expect(applySharedRemovals(definePreset(Aura), undefined)).toEqual(Aura);
    });

    it.each([[['__proto__', 'polluted']], ['components.button'], null, [[null]]])('rejects invalid shared removal paths: %j', async (removed) => {
        expect((await decodeShare(await encodeShare({ diff: {}, removed }))).ok).toBe(false);
    });
});
