/**
 * Safe dot-path access for theme presets.
 *
 * Theme documents can arrive from untrusted sources (imported JSON, share links), so every
 * write goes through a key guard. Reads are guarded too, to keep the surface uniform.
 *
 * @module service/designer/path
 */

/** Keys that must never be traversed or written, to avoid prototype pollution. */
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * @param {unknown} key
 * @returns {boolean} true when the key is a non-empty string that is safe to write
 */
export function isSafeKey(key) {
    return typeof key === 'string' && key.length > 0 && !UNSAFE_KEYS.has(key);
}

/**
 * Split a dot-path into segments. Accepts an array and returns it as-is.
 *
 * @param {string|string[]} path
 * @returns {string[]}
 */
export function toSegments(path) {
    if (Array.isArray(path)) {
        return path;
    }

    return typeof path === 'string' && path.length ? path.split('.') : [];
}

/**
 * @param {string|string[]} path
 * @returns {boolean} true when every segment of the path is safe
 */
export function isSafePath(path) {
    const segments = toSegments(path);

    return segments.length > 0 && segments.every(isSafeKey);
}

/**
 * Read a value at a dot-path. Returns undefined for unsafe or missing paths.
 *
 * @param {object} target
 * @param {string|string[]} path
 * @returns {*}
 */
export function getPath(target, path) {
    const segments = toSegments(path);

    if (!segments.length || !segments.every(isSafeKey)) {
        return undefined;
    }

    let current = target;

    for (const segment of segments) {
        if (current === null || typeof current !== 'object' || !Object.prototype.hasOwnProperty.call(current, segment)) {
            return undefined;
        }

        current = current[segment];
    }

    return current;
}

/**
 * Write a value at a dot-path, creating intermediate plain objects as needed.
 *
 * @param {object} target
 * @param {string|string[]} path
 * @param {*} value
 * @returns {boolean} true when the write happened
 */
export function setPath(target, path, value) {
    const segments = toSegments(path);

    if (!segments.length || !segments.every(isSafeKey) || target === null || typeof target !== 'object') {
        return false;
    }

    let current = target;

    for (let i = 0; i < segments.length - 1; i++) {
        const segment = segments[i];
        const next = current[segment];

        if (next === null || typeof next !== 'object') {
            current[segment] = {};
        }

        current = current[segment];
    }

    current[segments[segments.length - 1]] = value;

    return true;
}

/**
 * Delete the value at a dot-path.
 *
 * @param {object} target
 * @param {string|string[]} path
 * @returns {boolean} true when something was deleted
 */
export function deletePath(target, path) {
    const segments = toSegments(path);

    if (!segments.length || !segments.every(isSafeKey)) {
        return false;
    }

    const parentSegments = segments.slice(0, -1);
    const key = segments[segments.length - 1];
    const parent = parentSegments.length ? getPath(target, parentSegments) : target;

    if (parent === null || typeof parent !== 'object' || !Object.prototype.hasOwnProperty.call(parent, key)) {
        return false;
    }

    delete parent[key];

    return true;
}

/**
 * Recursively assert that an object graph contains no unsafe keys. Used at the import boundary
 * before the data is merged into live state.
 *
 * @param {*} value
 * @returns {string|null} the offending key, or null when the graph is clean
 */
export function findUnsafeKey(value) {
    if (value === null || typeof value !== 'object') {
        return null;
    }

    if (Array.isArray(value)) {
        for (const item of value) {
            const found = findUnsafeKey(item);

            if (found) {
                return found;
            }
        }

        return null;
    }

    for (const key of Object.keys(value)) {
        if (UNSAFE_KEYS.has(key)) {
            return key;
        }

        const found = findUnsafeKey(value[key]);

        if (found) {
            return found;
        }
    }

    return null;
}
