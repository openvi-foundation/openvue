/**
 * Undo/redo for token edits.
 *
 * Stores patches (`{path, before, after}`) rather than preset snapshots. A full preset is ~110 KB,
 * so a 50-deep snapshot stack would pin ~5.5 MB of heap for no benefit — a token edit only ever
 * touches one path.
 *
 * Consecutive writes to the same path within a short window collapse into one entry, so dragging
 * a colour picker is a single undo step rather than a hundred.
 *
 * @module service/designer/history
 */

/**
 * @typedef {object} HistoryPatch
 * @property {string} path dot-path of the edited token
 * @property {*} before
 * @property {*} after
 */

/**
 * @param {object} [options]
 * @param {number} [options.limit] maximum retained entries
 * @param {number} [options.coalesceMs] window within which same-path writes merge
 * @returns {object} history controller
 */
export function createHistory({ limit = 50, coalesceMs = 400 } = {}) {
    /** @type {HistoryPatch[]} */
    let entries = [];
    let index = -1;
    let lastAt = 0;

    /**
     * Record an edit. Any redo branch is discarded, matching editor conventions.
     *
     * @param {HistoryPatch} patch
     * @param {number} [now] injectable clock for tests
     * @returns {void}
     */
    function push(patch, now = Date.now()) {
        const current = entries[index];
        const coalescable = current && current.path === patch.path && now - lastAt <= coalesceMs && index === entries.length - 1;

        lastAt = now;

        if (coalescable) {
            current.after = patch.after;

            return;
        }

        entries = entries.slice(0, index + 1);
        entries.push({ path: patch.path, before: patch.before, after: patch.after });

        if (entries.length > limit) {
            entries.shift();
        }

        index = entries.length - 1;
    }

    /**
     * @returns {HistoryPatch|null} the patch to revert, or null when there is nothing to undo
     */
    function undo() {
        if (index < 0) {
            return null;
        }

        const patch = entries[index];

        index -= 1;
        lastAt = 0;

        return patch;
    }

    /**
     * @returns {HistoryPatch|null} the patch to reapply, or null when there is nothing to redo
     */
    function redo() {
        if (index >= entries.length - 1) {
            return null;
        }

        index += 1;
        lastAt = 0;

        return entries[index];
    }

    return {
        push,
        undo,
        redo,
        canUndo: () => index >= 0,
        canRedo: () => index < entries.length - 1,
        size: () => entries.length,
        clear: () => {
            entries = [];
            index = -1;
            lastAt = 0;
        }
    };
}
