/**
 * Local persistence for designer projects.
 *
 * localStorage rather than IndexedDB, deliberately: a full preset is ~110 KB of JSON, so the
 * ~5 MB origin quota holds dozens of themes, and a synchronous read is what lets the theme be
 * restored before first paint. IndexedDB is async-only and would reintroduce the flash.
 *
 * Every access is guarded — private browsing modes and quota exhaustion both throw — and the
 * adapter degrades to an in-memory store rather than breaking the editor.
 *
 * @module service/designer/storage
 */

import { clonePlain } from './document';

export const STORAGE_KEY = 'openvue-designer';

const STORE_VERSION = 1;

/** In-memory fallback, also the SSR-side value since there is no localStorage on the server. */
let memoryStore = null;

let usingMemory = false;

/**
 * @returns {boolean} true when a working localStorage is reachable
 */
function hasLocalStorage() {
    try {
        return typeof window !== 'undefined' && !!window.localStorage;
    } catch {
        return false;
    }
}

/**
 * @returns {{ version: number, themes: object[], activeId: string|null }}
 */
function emptyStore() {
    return { version: STORE_VERSION, themes: [], activeId: null };
}

/**
 * Read the whole store. Never throws.
 *
 * @returns {{ version: number, themes: object[], activeId: string|null }}
 */
export function readStore() {
    if (usingMemory || !hasLocalStorage()) {
        return memoryStore ? clonePlain(memoryStore) : emptyStore();
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return emptyStore();
        }

        const parsed = JSON.parse(raw);

        if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.themes)) {
            return emptyStore();
        }

        return { version: STORE_VERSION, themes: parsed.themes, activeId: parsed.activeId ?? null };
    } catch {
        return emptyStore();
    }
}

/**
 * Persist the whole store.
 *
 * @param {{ version: number, themes: object[], activeId: string|null }} store
 * @returns {{ ok: boolean, reason?: 'quota'|'unavailable' }}
 */
export function writeStore(store) {
    const payload = { version: STORE_VERSION, themes: store.themes, activeId: store.activeId ?? null };

    if (usingMemory || !hasLocalStorage()) {
        memoryStore = clonePlain(payload);

        return { ok: true };
    }

    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

        return { ok: true };
    } catch (error) {
        memoryStore = clonePlain(payload);
        usingMemory = true;

        const quotaExceeded = error && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED');

        return { ok: false, reason: quotaExceeded ? 'quota' : 'unavailable' };
    }
}

/**
 * @returns {boolean} true once a write has failed and the adapter fell back to memory
 */
export function isUsingMemoryFallback() {
    return usingMemory;
}

/**
 * @returns {object[]} all stored documents, newest first
 */
export function listThemes() {
    return readStore()
        .themes.slice()
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

/**
 * @param {string} id
 * @returns {object|null}
 */
export function loadTheme(id) {
    return readStore().themes.find((theme) => theme.id === id) || null;
}

/**
 * Insert or update a document by id and mark it as the active project.
 *
 * @param {object} doc
 * @returns {{ ok: boolean, reason?: string }}
 */
export function saveTheme(doc) {
    const store = readStore();
    const index = store.themes.findIndex((theme) => theme.id === doc.id);
    const record = { ...doc, updatedAt: Date.now() };

    if (index >= 0) {
        store.themes[index] = record;
    } else {
        store.themes.push(record);
    }

    store.activeId = doc.id;

    return writeStore(store);
}

/**
 * @param {string} id
 * @returns {{ ok: boolean, reason?: string }}
 */
export function deleteTheme(id) {
    const store = readStore();

    store.themes = store.themes.filter((theme) => theme.id !== id);

    if (store.activeId === id) {
        store.activeId = null;
    }

    return writeStore(store);
}

/**
 * @returns {string|null}
 */
export function getActiveId() {
    return readStore().activeId;
}

/**
 * @param {string|null} id
 * @returns {{ ok: boolean, reason?: string }}
 */
export function setActiveId(id) {
    const store = readStore();

    store.activeId = id;

    return writeStore(store);
}

/**
 * Test seam: drop the in-memory fallback state.
 */
export function resetForTests() {
    memoryStore = null;
    usingMemory = false;
}
