/**
 * The theme document model.
 *
 * A document is the unit the designer stores, exports and shares. It carries the full resolved
 * preset (not a diff) so the editor never has to reconstruct state, plus preview-only settings
 * that are deliberately excluded from generated theme code.
 *
 * @module service/designer/document
 */

/** Discriminator written into exported files so an arbitrary JSON cannot be mistaken for a theme. */
export const THEME_FORMAT = 'openvue-theme';

/** Bumped only on a breaking change to the document shape. Importers reject anything higher. */
export const SCHEMA_VERSION = 1;

/** Defaults for the preview-only typography settings. */
export const DEFAULT_CONFIG = Object.freeze({
    font_size: '14px',
    font_family: 'Inter var'
});

/**
 * @typedef {object} ThemeDocument
 * @property {string} format always {@link THEME_FORMAT}
 * @property {number} schemaVersion
 * @property {string} id local identifier, never part of an export
 * @property {string} name
 * @property {string} base name of the preset this theme was derived from
 * @property {object} preset the full resolved preset
 * @property {{ font_size: string, font_family: string }} config preview-only typography
 * @property {number} createdAt
 * @property {number} updatedAt
 */

/**
 * Deep copy that also strips Vue reactivity.
 *
 * `structuredClone` throws DataCloneError on a reactive proxy, and every document that reaches
 * this module has usually been through `$appState`. Presets are plain JSON — verified: no
 * functions anywhere in the tree — so a JSON round trip is both safe and proxy-transparent.
 *
 * @param {*} value
 * @returns {*}
 */
export function clonePlain(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

/**
 * @returns {string} a collision-resistant local id
 */
export function createId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    return 'theme-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

/**
 * Build a new document from a base preset.
 *
 * @param {object} options
 * @param {string} options.name
 * @param {string} options.base
 * @param {object} options.preset
 * @param {object} [options.config]
 * @returns {ThemeDocument}
 */
export function createDocument({ name, base, preset, config }) {
    const now = Date.now();

    return {
        format: THEME_FORMAT,
        schemaVersion: SCHEMA_VERSION,
        id: createId(),
        name: name,
        base: base,
        preset: clonePlain(preset),
        config: { ...DEFAULT_CONFIG, ...(config || {}) },
        createdAt: now,
        updatedAt: now
    };
}

/**
 * Deep clone a document under a new identity. Used by "duplicate".
 *
 * @param {ThemeDocument} doc
 * @param {string} [name]
 * @returns {ThemeDocument}
 */
export function cloneDocument(doc, name) {
    const now = Date.now();

    return {
        ...clonePlain(doc),
        id: createId(),
        name: name || doc.name + ' Copy',
        createdAt: now,
        updatedAt: now
    };
}

/**
 * Coerce an arbitrary parsed object into a well-formed local document. Assumes the value has
 * already cleared {@link module:service/designer/importer}; this only fills in local fields.
 *
 * @param {object} raw
 * @returns {ThemeDocument}
 */
export function normalizeDocument(raw) {
    const now = Date.now();

    return {
        format: THEME_FORMAT,
        schemaVersion: SCHEMA_VERSION,
        id: createId(),
        name: typeof raw.name === 'string' && raw.name.trim().length ? raw.name.trim() : 'Untitled',
        base: typeof raw.base === 'string' && raw.base.length ? raw.base : 'Aura',
        preset: clonePlain(raw.preset),
        config: { ...DEFAULT_CONFIG, ...(raw.config || {}) },
        createdAt: now,
        updatedAt: now
    };
}

/**
 * Strip local-only fields for export, so importing an exported file always creates a new project
 * rather than silently colliding with an existing one.
 *
 * @param {ThemeDocument} doc
 * @param {string} libraryVersion
 * @returns {object}
 */
export function toExportShape(doc, libraryVersion) {
    return {
        format: THEME_FORMAT,
        schemaVersion: SCHEMA_VERSION,
        libraryVersion: libraryVersion,
        name: doc.name,
        base: doc.base,
        preset: clonePlain(doc.preset),
        config: { ...doc.config }
    };
}
