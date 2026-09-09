/**
 * Share-link encoding.
 *
 * The payload is the *diff* against the base preset, not the whole preset: a full preset is
 * ~110 KB, which is ~15 KB even after gzip and base64 — too large for a URL. A hand-tuned theme
 * usually diffs to well under 2 KB.
 *
 * Compression is best-effort. `CompressionStream` is missing on older Safari, so the
 * uncompressed encoding is a first-class path rather than a rare fallback, and the version
 * prefix records which one was used.
 *
 * Data lives in the URL fragment, which browsers never send to the server.
 *
 * @module service/designer/share
 */

import { MAX_IMPORT_BYTES, byteLength } from './importer';
import { deletePath, findUnsafeKey, isSafePath } from './path';

const PREFIX_PLAIN = 'v1.';
const PREFIX_GZIP = 'v1.g.';

/**
 * @param {Uint8Array} bytes
 * @returns {string}
 */
function toBase64Url(bytes) {
    let binary = '';

    for (let i = 0; i < bytes.length; i += 0x8000) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    }

    const base64 = typeof btoa === 'function' ? btoa(binary) : Buffer.from(bytes).toString('base64');

    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * @param {string} value
 * @returns {Uint8Array}
 */
function fromBase64Url(value) {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);

    if (typeof atob === 'function') {
        const binary = atob(padded);
        const bytes = new Uint8Array(binary.length);

        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }

        return bytes;
    }

    return new Uint8Array(Buffer.from(padded, 'base64'));
}

/**
 * @returns {boolean} true when the browser can gzip
 */
function canCompress() {
    return typeof CompressionStream === 'function' && typeof Response === 'function';
}

/**
 * @param {Uint8Array} bytes
 * @returns {Promise<Uint8Array>}
 */
async function gzip(bytes) {
    const stream = new Response(bytes).body.pipeThrough(new CompressionStream('gzip'));

    return new Uint8Array(await new Response(stream).arrayBuffer());
}

/**
 * @param {Uint8Array} bytes
 * @returns {Promise<Uint8Array>}
 */
async function gunzip(bytes) {
    const stream = new Response(bytes).body.pipeThrough(new DecompressionStream('gzip'));

    return new Uint8Array(await new Response(stream).arrayBuffer());
}

/**
 * Encode a share payload into a URL-fragment-safe token.
 *
 * @param {{ name: string, base: string, diff: object, removed?: string[][], config?: object }} payload
 * @returns {Promise<string>}
 */
export async function encodeShare(payload) {
    const json = JSON.stringify(payload);
    const bytes = new TextEncoder().encode(json);

    if (canCompress()) {
        return PREFIX_GZIP + toBase64Url(await gzip(bytes));
    }

    return PREFIX_PLAIN + toBase64Url(bytes);
}

/**
 * Decode a share token produced by {@link encodeShare}. Handles both encodings regardless of
 * which one the current browser would produce.
 *
 * @param {string} token
 * @returns {Promise<{ ok: boolean, payload?: object, code?: string, message?: string }>}
 */
export async function decodeShare(token) {
    if (typeof token !== 'string' || token === '') {
        return { ok: false, code: 'empty', message: 'The share link is empty.' };
    }

    const compressed = token.startsWith(PREFIX_GZIP);
    const plain = !compressed && token.startsWith(PREFIX_PLAIN);

    if (!compressed && !plain) {
        return { ok: false, code: 'unknown-encoding', message: 'This share link uses an unsupported format.' };
    }

    const body = token.slice(compressed ? PREFIX_GZIP.length : PREFIX_PLAIN.length);

    let bytes;

    try {
        bytes = fromBase64Url(body);
    } catch {
        return { ok: false, code: 'malformed', message: 'The share link is malformed.' };
    }

    if (compressed) {
        if (typeof DecompressionStream !== 'function') {
            return { ok: false, code: 'no-decompression', message: 'This browser cannot read compressed share links.' };
        }

        try {
            bytes = await gunzip(bytes);
        } catch {
            return { ok: false, code: 'malformed', message: 'The share link could not be decompressed.' };
        }
    }

    if (bytes.length > MAX_IMPORT_BYTES) {
        return { ok: false, code: 'too-large', message: 'The share link payload is too large.' };
    }

    const json = new TextDecoder().decode(bytes);

    if (byteLength(json) > MAX_IMPORT_BYTES) {
        return { ok: false, code: 'too-large', message: 'The share link payload is too large.' };
    }

    try {
        const payload = JSON.parse(json);

        if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
            return { ok: false, code: 'malformed', message: 'The share link does not contain a theme.' };
        }

        if (findUnsafeKey(payload) || (payload.removed !== undefined && (!Array.isArray(payload.removed) || !payload.removed.every((path) => Array.isArray(path) && isSafePath(path))))) {
            return { ok: false, code: 'malformed', message: 'The share link contains unsafe token paths.' };
        }

        return { ok: true, payload };
    } catch {
        return { ok: false, code: 'malformed', message: 'The share link does not contain valid data.' };
    }
}

/** Apply the removals after merging a shared diff onto its base; old links omit this list. */
export function applySharedRemovals(preset, removed = []) {
    for (const path of removed) {
        deletePath(preset, path);
    }

    return preset;
}
