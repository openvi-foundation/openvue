/**
 * Deep object diffing for theme presets.
 *
 * The designer stores the full resolved preset as the source of truth, but exports the minimal
 * set of overrides against the base preset. That keeps generated theme files small and lets a
 * consumer keep tracking upstream changes to the base.
 *
 * @module service/designer/diff
 */

import { clonePlain } from './document';
import { isSafeKey } from './path';

/**
 * @param {*} value
 * @returns {boolean} true for plain objects (not arrays, not null)
 */
function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Minimal override object describing how `current` differs from `base`.
 *
 * Arrays and primitives are treated as leaves: any difference emits the whole `current` value.
 * Keys removed from `current` are carried separately by findRemovedPaths(), since a
 * definePreset override cannot express a deletion.
 *
 * @param {object} base
 * @param {object} current
 * @returns {object} an object containing only differing paths; empty when identical
 */
export function deepDiff(base, current) {
    const result = {};

    if (!isPlainObject(current)) {
        return result;
    }

    const safeBase = isPlainObject(base) ? base : {};

    for (const key of Object.keys(current)) {
        if (!isSafeKey(key)) {
            continue;
        }

        const currentValue = current[key];
        const baseValue = safeBase[key];

        if (isPlainObject(currentValue) && isPlainObject(baseValue)) {
            const nested = deepDiff(baseValue, currentValue);

            if (Object.keys(nested).length > 0) {
                result[key] = nested;
            }
        } else if (!isEqual(baseValue, currentValue)) {
            result[key] = currentValue;
        }
    }

    return result;
}

/** Removed paths use segments so literal dots in object keys remain unambiguous. */
export function findRemovedPaths(base, current, prefix = []) {
    if (!isPlainObject(base) || !isPlainObject(current)) return [];

    const removed = [];

    for (const key of Object.keys(base).filter(isSafeKey)) {
        const path = [...prefix, key];

        if (!Object.prototype.hasOwnProperty.call(current, key)) {
            removed.push(path);
        } else {
            removed.push(...findRemovedPaths(base[key], current[key], path));
        }
    }

    return removed;
}

/**
 * Structural equality for JSON-safe values.
 *
 * @param {*} a
 * @param {*} b
 * @returns {boolean}
 */
export function isEqual(a, b) {
    if (a === b) {
        return true;
    }

    if (Array.isArray(a) && Array.isArray(b)) {
        return a.length === b.length && a.every((item, index) => isEqual(item, b[index]));
    }

    if (isPlainObject(a) && isPlainObject(b)) {
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);

        return aKeys.length === bKeys.length && aKeys.every((key) => Object.prototype.hasOwnProperty.call(b, key) && isEqual(a[key], b[key]));
    }

    return false;
}

/**
 * Copy paths that exist in `source` but are missing from `target`, without ever overwriting a
 * value the user already set. This is the whole of the migration/compatibility behaviour.
 *
 * @param {object} target mutated in place
 * @param {object} source
 * @returns {string[]} dot-paths that were added
 */
export function deepMergeMissing(target, source, prefix = '') {
    const added = [];

    if (!isPlainObject(target) || !isPlainObject(source)) {
        return added;
    }

    for (const key of Object.keys(source)) {
        if (!isSafeKey(key)) {
            continue;
        }

        const path = prefix ? prefix + '.' + key : key;
        const sourceValue = source[key];

        if (!Object.prototype.hasOwnProperty.call(target, key)) {
            target[key] = clonePlain(sourceValue);

            // Report the individual leaves rather than the subtree root, so the list of added
            // tokens always matches what findMissingTokens showed the user beforehand.
            if (isPlainObject(sourceValue)) {
                added.push(...flattenLeaves(sourceValue, path).map((leaf) => leaf.path));
            } else {
                added.push(path);
            }
        } else if (isPlainObject(sourceValue) && isPlainObject(target[key])) {
            added.push(...deepMergeMissing(target[key], sourceValue, path));
        }
    }

    return added;
}

/**
 * Flatten an object graph into dot-path leaves.
 *
 * @param {object} source
 * @param {string} [prefix]
 * @returns {Array<{ path: string, value: * }>}
 */
export function flattenLeaves(source, prefix = '') {
    const leaves = [];

    if (!isPlainObject(source)) {
        return leaves;
    }

    for (const key of Object.keys(source)) {
        const path = prefix ? prefix + '.' + key : key;
        const value = source[key];

        if (isPlainObject(value)) {
            leaves.push(...flattenLeaves(value, path));
        } else {
            leaves.push({ path, value });
        }
    }

    return leaves;
}
