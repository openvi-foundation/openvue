/**
 * The migration assistant, run locally.
 *
 * When the library adds tokens in a new release, an existing theme is missing them. This finds
 * those paths by diffing against the current base preset and can add them with the base value as
 * a placeholder. It never overwrites a value the user already set — that is the entire contract.
 *
 * @module service/designer/compat
 */

import { deepMergeMissing, flattenLeaves } from './diff';
import { clonePlain } from './document';
import { getPath } from './path';

/**
 * Classify a token path for display in the migration list.
 *
 * @param {string} path
 * @returns {string}
 */
function classify(path) {
    if (path.startsWith('primitive.')) {
        return 'primitive';
    }

    if (path.startsWith('semantic.')) {
        return 'semantic';
    }

    if (path.startsWith('components.')) {
        return 'component';
    }

    return 'other';
}

/**
 * Paths present in the base preset but absent from the theme.
 *
 * @param {object} basePreset
 * @param {object} themePreset
 * @returns {Array<{ value: string, type: string, defaultValue: * }>}
 */
export function findMissingTokens(basePreset, themePreset) {
    const missing = [];

    for (const leaf of flattenLeaves(basePreset)) {
        if (getPath(themePreset, leaf.path) === undefined) {
            missing.push({ value: leaf.path, type: classify(leaf.path), defaultValue: leaf.value });
        }
    }

    return missing;
}

/**
 * Add every missing path from the base preset into a copy of the theme preset.
 *
 * @param {object} basePreset
 * @param {object} themePreset
 * @returns {{ preset: object, added: string[] }}
 */
export function applyMissingTokens(basePreset, themePreset) {
    const preset = clonePlain(themePreset);
    const added = deepMergeMissing(preset, basePreset);

    return { preset, added };
}
