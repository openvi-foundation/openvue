import { afterEach, describe, expect, it } from 'vitest';
import { decodeShare, encodeShare } from '../../service/designer/share';

const nativeCompressionStream = globalThis.CompressionStream;

/**
 * @returns {object} a representative share payload — a diff, not a whole preset
 */
function payload() {
    return {
        name: 'My Theme',
        base: 'Aura',
        diff: { semantic: { primary: { color: '{blue.500}' } }, components: { button: { root: { borderRadius: '0px' } } } },
        config: { font_size: '14px', font_family: 'Inter var' }
    };
}

describe('designer/share', () => {
    afterEach(() => {
        globalThis.CompressionStream = nativeCompressionStream;
    });

    it('round-trips through the compressed encoding', async () => {
        const token = await encodeShare(payload());

        expect(token.startsWith('v1.g.')).toBe(true);

        const result = await decodeShare(token);

        expect(result.ok).toBe(true);
        expect(result.payload).toEqual(payload());
    });

    it('round-trips through the uncompressed encoding when CompressionStream is missing', async () => {
        globalThis.CompressionStream = undefined;

        const token = await encodeShare(payload());

        expect(token.startsWith('v1.')).toBe(true);
        expect(token.startsWith('v1.g.')).toBe(false);

        globalThis.CompressionStream = nativeCompressionStream;

        const result = await decodeShare(token);

        expect(result.ok).toBe(true);
        expect(result.payload).toEqual(payload());
    });

    it('decodes an uncompressed token even on a browser that can compress', async () => {
        globalThis.CompressionStream = undefined;

        const token = await encodeShare(payload());

        globalThis.CompressionStream = nativeCompressionStream;

        expect((await decodeShare(token)).ok).toBe(true);
    });

    it('produces a URL-fragment-safe token', async () => {
        const token = await encodeShare(payload());

        expect(token).toMatch(/^[A-Za-z0-9._-]+$/);
    });

    it('compresses a realistic diff to a manageable size', async () => {
        const token = await encodeShare(payload());

        expect(token.length).toBeLessThan(2048);
    });

    it('rejects an unknown encoding prefix', async () => {
        expect((await decodeShare('v9.abcdef')).code).toBe('unknown-encoding');
    });

    it('rejects empty input', async () => {
        expect((await decodeShare('')).code).toBe('empty');
        expect((await decodeShare(null)).code).toBe('empty');
    });

    it('rejects a corrupted compressed body', async () => {
        expect((await decodeShare('v1.g.bm90LWd6aXA')).code).toBe('malformed');
    });

    it('rejects a body that is not JSON', async () => {
        const token = 'v1.' + Buffer.from('not json at all').toString('base64url');

        expect((await decodeShare(token)).code).toBe('malformed');
    });

    it('rejects a JSON body that is not an object', async () => {
        const token = 'v1.' + Buffer.from('[1,2,3]').toString('base64url');

        expect((await decodeShare(token)).code).toBe('malformed');
    });
});
