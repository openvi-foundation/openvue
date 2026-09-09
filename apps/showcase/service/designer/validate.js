/**
 * Theme preset validation.
 *
 * Pure and DOM-free by design so it can be unit tested without a browser. Contrast checking is
 * deliberately NOT here: token values are references (`{primary.500}`), `color-mix()` and
 * `oklch()` strings that only resolve against a live document, so that check is DOM-coupled and
 * lives with the editor UI as a warning.
 *
 * The subtlety in here is that references are written in dot-case against the *token* namespace,
 * not as literal object paths: `{border.radius.md}` addresses `primitive.borderRadius.md` and
 * `{text.hover.color}` addresses `colorScheme.<scheme>.text.hoverColor`. So resolution works by
 * building the same flattened token namespace the editor's autocomplete uses, then checking
 * membership — the camelCase-to-dot-case direction is unambiguous, the reverse is not.
 *
 * @module service/designer/validate
 */

/** Severity that blocks export — these produce CSS that will not render. */
export const SEVERITY_ERROR = 'error';

/** Severity that is surfaced but does not block export. */
export const SEVERITY_WARNING = 'warning';

/** Matches every `{token.path}` occurrence in a token value. */
const REFERENCE_PATTERN = /{([^{}]+)}/g;

/** Custom token names are dot-separated lowercase segments, e.g. `accent.color`. */
const CUSTOM_TOKEN_PATTERN = /^[a-z0-9]+(\.[a-z0-9]+)*$/;

/** Keys that carry raw CSS rather than tokens. */
const NON_TOKEN_KEYS = new Set(['css', 'directives']);

/**
 * Convert an object path to its token name, matching the theming engine's variable naming.
 *
 * @param {string} name
 * @returns {string}
 */
export function camelCaseToDotCase(name) {
    return name
        .replace(/([a-z])([A-Z])/g, '$1.$2')
        .replace(/([a-zA-Z])(\d)/g, '$1.$2')
        .toLowerCase();
}

/**
 * Extract the token paths referenced by a value.
 *
 * @param {*} value
 * @returns {string[]} referenced token paths, without braces
 */
export function extractReferences(value) {
    if (typeof value !== 'string') {
        return [];
    }

    const references = [];
    let match = REFERENCE_PATTERN.exec(value);

    while (match !== null) {
        references.push(match[1].trim());
        match = REFERENCE_PATTERN.exec(value);
    }

    REFERENCE_PATTERN.lastIndex = 0;

    return references;
}

/**
 * @param {*} value
 * @returns {boolean}
 */
function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Flatten a token subtree into dot-case token names.
 *
 * @param {object} source
 * @param {string} prefix object path prefix, converted to dot-case per segment
 * @param {Map<string, { value: *, path: string }>} sink
 * @param {string} objectPrefix full object path, kept for reporting
 */
function collect(source, prefix, sink, objectPrefix) {
    if (!isPlainObject(source)) {
        return;
    }

    for (const key of Object.keys(source)) {
        if (NON_TOKEN_KEYS.has(key)) {
            continue;
        }

        const value = source[key];
        const name = prefix ? prefix + '.' + camelCaseToDotCase(key) : camelCaseToDotCase(key);
        const path = objectPrefix ? objectPrefix + '.' + key : key;

        if (isPlainObject(value)) {
            collect(value, name, sink, path);
        } else if (!sink.has(name)) {
            sink.set(name, { value, path });
        }
    }
}

/**
 * Build the token namespace visible for one colour scheme, mirroring how the engine resolves.
 *
 * @param {object} preset
 * @param {'light'|'dark'} scheme
 * @returns {Map<string, { value: *, path: string }>}
 */
function buildScheme(preset, scheme) {
    const tokens = new Map();
    const semantic = isPlainObject(preset.semantic) ? preset.semantic : {};
    const colorScheme = isPlainObject(semantic.colorScheme) ? semantic.colorScheme : {};

    collect(colorScheme[scheme], '', tokens, 'semantic.colorScheme.' + scheme);

    for (const key of Object.keys(semantic)) {
        if (key !== 'colorScheme') {
            collect({ [key]: semantic[key] }, '', tokens, 'semantic');
        }
    }

    collect(preset.primitive, '', tokens, 'primitive');
    collect(preset.extend, '', tokens, 'extend');

    if (isPlainObject(preset.components)) {
        for (const component of Object.keys(preset.components)) {
            const definition = preset.components[component];

            if (!isPlainObject(definition)) {
                continue;
            }

            const componentScheme = isPlainObject(definition.colorScheme) ? definition.colorScheme[scheme] : null;
            const prefix = camelCaseToDotCase(component);
            const schemePath = 'components.' + component + '.colorScheme.' + scheme;

            for (const key of Object.keys(definition)) {
                if (key !== 'colorScheme') {
                    collect({ [key]: definition[key] }, prefix, tokens, 'components.' + component);
                }
            }

            collect(componentScheme, prefix, tokens, schemePath);

            // A component's `root` section is addressed without the `root` segment — the engine
            // emits `--p-datatable-border-color`, so `{datatable.border.color}` is the reference
            // that resolves to `root.borderColor`.
            collect(definition.root, prefix, tokens, 'components.' + component + '.root');
            collect(componentScheme?.root, prefix, tokens, schemePath + '.root');
        }
    }

    return tokens;
}

/**
 * Find one cycle per entry point using a colour-marked depth-first search.
 *
 * @param {Map<string, string[]>} graph
 * @returns {string[][]} each entry is the cycle path with the first node repeated at the end
 */
function findCycles(graph) {
    const WHITE = 0;
    const GRAY = 1;
    const BLACK = 2;
    const colours = new Map();
    const cycles = [];
    const stack = [];

    function visit(node) {
        colours.set(node, GRAY);
        stack.push(node);

        for (const next of graph.get(node) || []) {
            const colour = colours.get(next) ?? WHITE;

            if (colour === GRAY) {
                cycles.push(stack.slice(stack.indexOf(next)).concat(next));
            } else if (colour === WHITE && graph.has(next)) {
                visit(next);
            }
        }

        stack.pop();
        colours.set(node, BLACK);
    }

    for (const node of graph.keys()) {
        if ((colours.get(node) ?? WHITE) === WHITE) {
            visit(node);
        }
    }

    return cycles;
}

/**
 * @typedef {object} ValidationIssue
 * @property {'error'|'warning'} severity
 * @property {string} code
 * @property {string} message
 * @property {string} [path]
 */

/**
 * Validate a preset.
 *
 * Pass the base preset to downgrade problems the theme inherited rather than caused. Some
 * built-in presets ship with unresolved references upstream (Lara, for one), and blocking a user's
 * export over a defect they did not introduce would be wrong — they are still surfaced, as
 * warnings.
 *
 * @param {object} preset
 * @param {object} [basePreset] the preset this theme was derived from
 * @returns {{ issues: ValidationIssue[], errorCount: number, warningCount: number, canExport: boolean }}
 */
export function validatePreset(preset, basePreset = null) {
    const result = collectIssues(preset);

    if (!basePreset) {
        return result;
    }

    const inherited = new Set(collectIssues(basePreset).issues.map((issue) => issue.code + '|' + (issue.path ?? '')));

    return summarize(
        result.issues.map((issue) => {
            if (issue.severity !== SEVERITY_ERROR || !inherited.has(issue.code + '|' + (issue.path ?? ''))) {
                return issue;
            }

            return { ...issue, severity: SEVERITY_WARNING, inherited: true, message: issue.message + ' (inherited from the base theme)' };
        })
    );
}

/**
 * @param {object} preset
 * @returns {{ issues: ValidationIssue[], errorCount: number, warningCount: number, canExport: boolean }}
 */
function collectIssues(preset) {
    const issues = [];

    if (!isPlainObject(preset)) {
        return summarize([{ severity: SEVERITY_ERROR, code: 'invalid-preset', message: 'Preset is not an object.' }]);
    }

    // Each scheme is checked against its own namespace, so a token that only exists in one scheme
    // is not reported as broken in the other.
    for (const scheme of ['light', 'dark']) {
        const tokens = buildScheme(preset, scheme);
        const graph = new Map();

        for (const [name, entry] of tokens) {
            if (typeof entry.value === 'string' && entry.value.trim() === '') {
                issues.push({ severity: SEVERITY_WARNING, code: 'empty-value', message: 'Token has an empty value.', path: entry.path });
            }

            const targets = [];

            for (const reference of extractReferences(entry.value)) {
                // Presets write references both ways — `{overlay.popover.borderRadius}` and
                // `{border.radius.md}` — so normalize before looking up.
                const normalized = tokens.has(reference) ? reference : camelCaseToDotCase(reference);

                if (tokens.has(normalized)) {
                    targets.push(normalized);
                } else {
                    issues.push({ severity: SEVERITY_ERROR, code: 'broken-reference', message: 'Reference {' + reference + '} does not resolve to a token in the ' + scheme + ' scheme.', path: entry.path });
                }
            }

            if (targets.length) {
                graph.set(name, targets);
            }
        }

        for (const cycle of findCycles(graph)) {
            issues.push({ severity: SEVERITY_ERROR, code: 'reference-cycle', message: 'Reference cycle in the ' + scheme + ' scheme: ' + cycle.join(' → '), path: tokens.get(cycle[0])?.path ?? cycle[0] });
        }
    }

    if (isPlainObject(preset.extend)) {
        const names = new Map();

        collect(preset.extend, '', names, 'extend');

        for (const [, entry] of names) {
            const customName = entry.path.replace(/^extend\./, '');

            if (!CUSTOM_TOKEN_PATTERN.test(customName)) {
                issues.push({ severity: SEVERITY_WARNING, code: 'malformed-custom-token', message: 'Custom token names should be dot-separated lowercase, e.g. accent.color.', path: entry.path });
            }
        }
    }

    return summarize(dedupe(issues));
}

/**
 * Both colour schemes share most tokens, so the same problem is usually found twice.
 *
 * @param {ValidationIssue[]} issues
 * @returns {ValidationIssue[]}
 */
function dedupe(issues) {
    const seen = new Set();

    return issues.filter((issue) => {
        const key = issue.code + '|' + (issue.path ?? '');

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);

        return true;
    });
}

/**
 * @param {ValidationIssue[]} issues
 * @returns {{ issues: ValidationIssue[], errorCount: number, warningCount: number, canExport: boolean }}
 */
function summarize(issues) {
    const errorCount = issues.filter((issue) => issue.severity === SEVERITY_ERROR).length;

    return {
        issues,
        errorCount,
        warningCount: issues.length - errorCount,
        canExport: errorCount === 0
    };
}
