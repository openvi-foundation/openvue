import { isSafePath, setPath } from './path';

/** Validate the entire draft before replacing any saved custom tokens. */
export function buildCustomTokens(rows) {
    const names = [];
    const tokens = {};

    for (const [index, row] of rows.entries()) {
        const name = typeof row.name === 'string' ? row.name.trim() : '';
        const value = row.value;

        if (!/^[a-z0-9]+(\.[a-z0-9]+)*$/.test(name) || !isSafePath(name)) {
            return { ok: false, message: 'Token ' + (index + 1) + ' needs a safe, dot-separated lowercase name.' };
        }

        if (typeof value !== 'string' || !value.trim()) {
            return { ok: false, message: 'Token ' + (index + 1) + ' needs a value.' };
        }

        if (names.some((other) => other === name || other.startsWith(name + '.') || name.startsWith(other + '.'))) {
            return { ok: false, message: 'Token ' + name + ' overlaps another token name.' };
        }

        names.push(name);
        setPath(tokens, name, value);
    }

    return { ok: true, tokens };
}
