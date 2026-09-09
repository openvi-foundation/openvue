/**
 * The untrusted input boundary.
 *
 * Everything arriving from a file upload or a share link passes through here before it is
 * allowed near live state. Nothing in this module executes user input — a theme is data, and a
 * `.ts` export is generated text, never something the browser evaluates.
 *
 * @module service/designer/importer
 */

import { SCHEMA_VERSION, THEME_FORMAT, normalizeDocument } from './document';
import { findUnsafeKey } from './path';
import { validatePreset } from './validate';

/** Refuse anything larger than this; a full preset is ~110 KB, so this is generous. */
export const MAX_IMPORT_BYTES = 2 * 1024 * 1024;

/**
 * @typedef {object} ImportResult
 * @property {boolean} ok
 * @property {object} [document] the normalized document, when ok
 * @property {object} [validation] validation summary for the imported preset, when ok
 * @property {string} [code] machine-readable failure code, when not ok
 * @property {string} [message] human-readable failure reason, when not ok
 */

/**
 * @param {string} code
 * @param {string} message
 * @returns {ImportResult}
 */
function fail(code, message) {
    return { ok: false, code, message };
}

/**
 * Measure a string in bytes rather than UTF-16 code units, so the cap means what it says.
 *
 * @param {string} text
 * @returns {number}
 */
export function byteLength(text) {
    if (typeof TextEncoder !== 'undefined') {
        return new TextEncoder().encode(text).length;
    }

    return Buffer.byteLength(text, 'utf8');
}

/**
 * Validate and normalize raw JSON text into a local theme document.
 *
 * @param {string} text
 * @returns {ImportResult}
 */
export function importThemeJson(text) {
    if (typeof text !== 'string' || text.trim() === '') {
        return fail('empty', 'The file is empty.');
    }

    if (byteLength(text) > MAX_IMPORT_BYTES) {
        return fail('too-large', 'Theme files are limited to 2 MB.');
    }

    let parsed;

    try {
        parsed = JSON.parse(text);
    } catch {
        return fail('invalid-json', 'The file is not valid JSON.');
    }

    return importThemeObject(parsed);
}

/**
 * Validate and normalize an already-parsed object.
 *
 * @param {*} parsed
 * @returns {ImportResult}
 */
export function importThemeObject(parsed) {
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return fail('not-an-object', 'The theme file must contain an object.');
    }

    if (parsed.format !== THEME_FORMAT) {
        return fail('unknown-format', 'This does not look like an OpenVue theme file.');
    }

    const version = Number(parsed.schemaVersion);

    if (!Number.isFinite(version) || version < 1) {
        return fail('invalid-version', 'The theme file has no usable schema version.');
    }

    if (version > SCHEMA_VERSION) {
        return fail('future-version', 'This theme was made with a newer version of the designer. Update the site and try again.');
    }

    if (parsed.preset === null || typeof parsed.preset !== 'object' || Array.isArray(parsed.preset)) {
        return fail('invalid-preset', 'The theme file has no preset object.');
    }

    const unsafeKey = findUnsafeKey(parsed);

    if (unsafeKey) {
        return fail('unsafe-key', 'The theme file contains a disallowed key: ' + unsafeKey + '.');
    }

    const document = normalizeDocument(parsed);

    return { ok: true, document, validation: validatePreset(document.preset) };
}
