import { describe, expect, it } from 'vitest';
import { camelCaseToDotCase, extractReferences, validatePreset } from '../../service/designer/validate';

/**
 * Structurally faithful to a real preset: camelCase object keys addressed by dot-case references,
 * a colour scheme split, and a component that references semantic tokens.
 *
 * @returns {object}
 */
function basePreset() {
    return {
        primitive: {
            borderRadius: { md: '6px' },
            green: { 500: '#22c55e' },
            zinc: { 950: '#09090b' }
        },
        semantic: {
            primary: { color: '{green.500}' },
            formField: { borderRadius: '{border.radius.md}' },
            colorScheme: {
                light: {
                    surface: { 0: '#ffffff' },
                    text: { color: '{zinc.950}', hoverColor: '{zinc.950}' }
                },
                dark: {
                    surface: { 0: '#09090b' },
                    text: { color: '#ffffff', hoverColor: '#ffffff' }
                }
            }
        },
        components: {
            button: {
                root: { background: '{primary.color}', color: '{text.hover.color}' }
            }
        }
    };
}

describe('designer/validate', () => {
    describe('camelCaseToDotCase', () => {
        it('matches the theming engine token naming', () => {
            expect(camelCaseToDotCase('borderRadius')).toBe('border.radius');
            expect(camelCaseToDotCase('hoverColor')).toBe('hover.color');
            expect(camelCaseToDotCase('color')).toBe('color');
        });
    });

    describe('extractReferences', () => {
        it('finds every reference in a value', () => {
            expect(extractReferences('color-mix(in srgb, {primary.color}, {surface.0} 50%)')).toEqual(['primary.color', 'surface.0']);
        });

        it('returns nothing for non-strings, including numbers', () => {
            expect(extractReferences(400)).toEqual([]);
            expect(extractReferences(null)).toEqual([]);
            expect(extractReferences(undefined)).toEqual([]);
        });

        it('is not affected by a previous call leaving regex state behind', () => {
            extractReferences('{a.b} {c.d}');
            expect(extractReferences('{a.b}')).toEqual(['a.b']);
        });
    });

    describe('validatePreset', () => {
        it('passes a clean preset', () => {
            const result = validatePreset(basePreset());

            expect(result.issues).toEqual([]);
            expect(result.canExport).toBe(true);
        });

        // References address the dot-case token namespace, not literal object paths.
        it('resolves dot-case references to camelCase keys', () => {
            const result = validatePreset(basePreset());

            expect(result.issues.filter((issue) => issue.code === 'broken-reference')).toEqual([]);
        });

        it('flags a broken reference as a blocking error', () => {
            const preset = basePreset();

            preset.semantic.primary.color = '{missing.500}';

            const result = validatePreset(preset);
            const issue = result.issues.find((entry) => entry.code === 'broken-reference');

            expect(issue).toBeDefined();
            expect(issue.severity).toBe('error');
            expect(result.canExport).toBe(false);
        });

        it('reports a broken reference once, not once per colour scheme', () => {
            const preset = basePreset();

            preset.semantic.primary.color = '{missing.500}';

            expect(validatePreset(preset).issues.filter((entry) => entry.code === 'broken-reference')).toHaveLength(1);
        });

        it('detects a direct reference cycle', () => {
            const preset = basePreset();

            preset.semantic.primary.color = '{primary.color}';

            const result = validatePreset(preset);

            expect(result.issues.some((entry) => entry.code === 'reference-cycle')).toBe(true);
            expect(result.canExport).toBe(false);
        });

        it('detects an indirect reference cycle', () => {
            const preset = basePreset();

            preset.semantic.alpha = { one: '{beta.two}' };
            preset.semantic.beta = { two: '{alpha.one}' };

            expect(validatePreset(preset).issues.some((entry) => entry.code === 'reference-cycle')).toBe(true);
        });

        it('does not report a cycle for a long acyclic chain', () => {
            const preset = basePreset();

            preset.semantic.alpha = { one: '{green.500}' };
            preset.semantic.beta = { two: '{alpha.one}' };
            preset.semantic.gamma = { three: '{beta.two}' };

            expect(validatePreset(preset).issues.some((entry) => entry.code === 'reference-cycle')).toBe(false);
        });

        it('treats an empty value as a non-blocking warning', () => {
            const preset = basePreset();

            preset.semantic.primary.color = '   ';

            const result = validatePreset(preset);
            const issue = result.issues.find((entry) => entry.code === 'empty-value');

            expect(issue.severity).toBe('warning');
            expect(result.canExport).toBe(true);
        });

        it('warns about a malformed custom token name', () => {
            const preset = basePreset();

            preset.extend = { 'Accent Color': '#eab308' };

            const result = validatePreset(preset);
            const issue = result.issues.find((entry) => entry.code === 'malformed-custom-token');

            expect(issue.severity).toBe('warning');
            expect(result.canExport).toBe(true);
        });

        it('accepts a well-formed custom token and lets others reference it', () => {
            const preset = basePreset();

            preset.extend = { accent: { color: '#eab308' } };
            preset.semantic.primary.color = '{accent.color}';

            expect(validatePreset(preset).errorCount).toBe(0);
        });

        it('ignores raw css blocks rather than treating them as tokens', () => {
            const preset = basePreset();

            preset.css = '.foo { color: red }';
            preset.components.button.css = '.bar { color: blue }';

            expect(validatePreset(preset).errorCount).toBe(0);
        });

        it('rejects a non-object preset outright', () => {
            expect(validatePreset(null).canExport).toBe(false);
            expect(validatePreset('nope').canExport).toBe(false);
        });

        it('tolerates numeric token values without throwing', () => {
            const preset = basePreset();

            preset.semantic.fontWeight = 500;

            expect(() => validatePreset(preset)).not.toThrow();
        });
    });
});
