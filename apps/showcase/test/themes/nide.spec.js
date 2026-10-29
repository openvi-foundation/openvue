import { describe, expect, it } from 'vitest';
import Aura from '@openvue/themes/aura';
import Nide from '@openvue/themes/nide';
import NideButton from '@openvue/themes/nide/button';
import { camelCaseToDotCase, validatePreset } from '../../service/designer/validate';

const auraSnapshot = JSON.stringify(Aura);

function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function leafPaths(node, prefix = []) {
    return Object.entries(node).flatMap(([key, value]) => (isPlainObject(value) ? leafPaths(value, [...prefix, key]) : [[...prefix, key]]));
}

function getPath(node, path) {
    return path.reduce((current, key) => (isPlainObject(current) && key in current ? current[key] : undefined), node);
}

// Nide moves some tokens into a colour scheme, so a path is known if Aura has it at either level.
function existsInAura(auraNode, path) {
    if (getPath(auraNode, path) !== undefined) return true;

    if (path[0] === 'colorScheme') return getPath(auraNode, path.slice(2)) !== undefined;

    return ['light', 'dark'].some((scheme) => getPath(auraNode, ['colorScheme', scheme, ...path]) !== undefined);
}

function tokenMap(preset, scheme) {
    const map = new Map();

    const add = (node, prefix) => {
        for (const [key, value] of Object.entries(node || {})) {
            if (key === 'colorScheme' || key === 'css') continue;

            const name = [...prefix, camelCaseToDotCase(key)].filter((segment) => segment !== 'root').join('.');

            if (isPlainObject(value)) add(value, name.split('.').filter(Boolean));
            else map.set(name, value);
        }
    };

    add(preset.primitive, []);
    add(preset.semantic, []);
    add(preset.semantic.colorScheme?.[scheme], []);

    for (const [component, tokens] of Object.entries(preset.components)) {
        add(tokens, [component]);
        add(tokens.colorScheme?.[scheme], [component]);
    }

    return map;
}

function resolve(map, value, seen = []) {
    if (typeof value !== 'string') return value;

    // References are dot-case, but the engine also accepts camelCase ones, which Aura uses in places.
    return value.replace(/{([^{}]+)}/g, (_, reference) => {
        const name = camelCaseToDotCase(reference.trim());

        if (seen.includes(name)) throw new Error(`reference cycle at ${name}`);
        if (!map.has(name)) throw new Error(`unresolved reference {${name}}`);

        return resolve(map, map.get(name), [...seen, name]);
    });
}

function parseColor(input) {
    const value = input.trim();
    const hex = /^#([0-9a-f]{6})$/i.exec(value);

    if (hex) return [0, 2, 4].map((offset) => parseInt(hex[1].slice(offset, offset + 2), 16)).concat(1);
    if (value === 'transparent') return [0, 0, 0, 0];

    const rgba = /^rgba?\(([^)]+)\)$/.exec(value);

    if (rgba) {
        const [r, g, b, a = 1] = rgba[1].split(',').map(Number);

        return [r, g, b, a];
    }

    const mix = /^color-mix\(in srgb,\s*(.+)\)$/.exec(value);

    if (mix) {
        const [first, second] = splitTopLevel(mix[1]);

        const parse = (part) => {
            const match = /^(.*?)(?:\s+([\d.]+)%)?$/.exec(part.trim());

            return { color: parseColor(match[1]), percent: match[2] === undefined ? undefined : Number(match[2]) / 100 };
        };

        const a = parse(first);
        const b = parse(second);
        const weightB = b.percent ?? (a.percent === undefined ? 0.5 : 1 - a.percent);
        const weightA = 1 - weightB;
        const alpha = a.color[3] * weightA + b.color[3] * weightB;
        const channel = (index) => (alpha === 0 ? 0 : (a.color[index] * a.color[3] * weightA + b.color[index] * b.color[3] * weightB) / alpha);

        return [channel(0), channel(1), channel(2), alpha];
    }

    throw new Error(`unsupported colour ${value}`);
}

function splitTopLevel(text) {
    let depth = 0;

    for (let index = 0; index < text.length; index++) {
        if (text[index] === '(') depth++;
        if (text[index] === ')') depth--;
        if (text[index] === ',' && depth === 0) return [text.slice(0, index), text.slice(index + 1)];
    }

    throw new Error(`cannot split ${text}`);
}

function over(foreground, background) {
    const alpha = foreground[3];

    return [0, 1, 2].map((index) => foreground[index] * alpha + background[index] * (1 - alpha)).concat(1);
}

function luminance([r, g, b]) {
    const channel = (value) => {
        const srgb = value / 255;

        return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
    };

    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(map, foregroundToken, backgroundToken, pageToken) {
    const page = parseColor(resolve(map, map.get(pageToken)));
    const background = over(parseColor(resolve(map, map.get(backgroundToken))), page);
    const foreground = over(parseColor(resolve(map, map.get(foregroundToken))), background);
    const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);

    return (lighter + 0.05) / (darker + 0.05);
}

const PAGE = { light: 'surface.0', dark: 'surface.950' };

describe('themes/nide', () => {
    it('ships the same components as Aura', () => {
        expect(Object.keys(Nide.components).sort()).toEqual(Object.keys(Aura.components).sort());
        expect(Object.keys(Nide).sort()).toEqual(Object.keys(Aura).sort());
    });

    it('has no unresolved references or reference cycles', () => {
        const result = validatePreset(Nide);

        expect(result.issues.filter((issue) => issue.severity === 'error')).toEqual([]);
        expect(result.canExport).toBe(true);
    });

    it.each(['light', 'dark'])('resolves every token to a value in %s mode', (scheme) => {
        const map = tokenMap(Nide, scheme);

        for (const [name, value] of map) {
            expect(() => resolve(map, value), name).not.toThrow();
        }
    });

    // A misspelt key would silently do nothing, so every token Nide adds must be one Aura defines.
    it('only overrides tokens that exist', () => {
        const unknown = [];

        for (const [component, tokens] of Object.entries(Nide.components)) {
            for (const path of leafPaths(tokens)) {
                if (path[0] === 'css') continue;
                if (!existsInAura(Aura.components[component], path)) unknown.push(`components.${component}.${path.join('.')}`);
            }
        }

        for (const path of leafPaths(Nide.semantic)) {
            if (!existsInAura(Aura.semantic, path)) unknown.push(`semantic.${path.join('.')}`);
        }

        for (const path of leafPaths(Nide.primitive)) {
            if (getPath(Aura.primitive, path) === undefined) unknown.push(`primitive.${path.join('.')}`);
        }

        expect(unknown).toEqual([]);
    });

    it.each(['light', 'dark'])('only references existing tokens from its component CSS in %s mode', (scheme) => {
        const map = tokenMap(Nide, scheme);
        const missing = [];

        for (const [component, tokens] of Object.entries(Nide.components)) {
            if (typeof tokens.css !== 'string') continue;

            for (const [, name] of tokens.css.matchAll(/dt\('([^']+)'\)/g)) {
                if (!map.has(name)) missing.push(`${component}: ${name}`);
            }
        }

        expect(missing).toEqual([]);
    });

    it('leaves Aura untouched', () => {
        expect(JSON.stringify(Aura)).toBe(auraSnapshot);
        expect(NideButton).toBe(Nide.components.button);
    });

    it('keeps the shadcn/ui radius scale', () => {
        expect(Nide.primitive.borderRadius).toEqual({ none: '0', xs: '4px', sm: '6px', md: '8px', lg: '10px', xl: '14px' });
    });

    // iOS zooms into a focused field whose text is under 16px, so every field Nide sets at text-sm
    // goes back to 16px below 768px, like shadcn/ui's `text-base md:text-sm`.
    it.each([
        ['inputtext', '.p-inputtext:not(.p-inputtext-sm, .p-inputtext-lg)'],
        ['textarea', '.p-textarea:not(.p-textarea-sm, .p-textarea-lg)'],
        ['autocomplete', '.p-autocomplete-input-chip input'],
        ['inputchips', '.p-inputchips-input-item input'],
        ['select', '.p-select:not(.p-select-sm, .p-select-lg) input.p-select-label'],
        ['terminal', '.p-terminal']
    ])('keeps %s at 16px on phones', (component, selector) => {
        const media = Nide.components[component].css.split('@media (max-width: 47.99rem)')[1] ?? '';

        expect(media).toContain(`${selector} {\n        font-size: 1rem;`);
    });

    // SelectButton draws its options as ToggleButtons, so its outer corners must match the track they form.
    it('gives SelectButton the same track radius as ToggleButton', () => {
        expect(Nide.components.selectbutton.root.borderRadius).toBe(Nide.components.togglebutton.root.borderRadius);
    });

    describe.each(['light', 'dark'])('%s mode contrast', (scheme) => {
        const map = tokenMap(Nide, scheme);
        const page = PAGE[scheme];

        it.each([
            ['body text', 'text.color', 'content.background'],
            ['muted text', 'text.muted.color', 'content.background'],
            ['form field text', 'form.field.color', 'form.field.background'],
            ['placeholder', 'form.field.placeholder.color', 'form.field.background'],
            ['highlighted option', 'highlight.color', 'highlight.background'],
            ['popover text', 'overlay.popover.color', 'overlay.popover.background'],
            ['muted dialog text', 'text.muted.color', 'overlay.modal.background'],
            ['current step number', 'stepper.step.number.active.color', 'stepper.step.number.active.background'],
            ['tooltip', 'tooltip.color', 'tooltip.background']
        ])('%s meets WCAG AA', (_, foreground, background) => {
            expect(contrast(map, foreground, background, page)).toBeGreaterThanOrEqual(4.5);
        });

        it.each(['primary', 'secondary', 'info', 'success', 'warn', 'help', 'danger', 'contrast'])('%s button label meets WCAG AA', (severity) => {
            expect(contrast(map, `button.${severity}.color`, `button.${severity}.background`, page)).toBeGreaterThanOrEqual(4.5);
            expect(contrast(map, `button.${severity}.hover.color`, `button.${severity}.hover.background`, page)).toBeGreaterThanOrEqual(4.5);
        });

        it.each(['primary', 'secondary', 'success', 'info', 'warn', 'help', 'danger', 'contrast', 'plain'])('%s text button meets WCAG AA', (severity) => {
            expect(contrast(map, `button.text.${severity}.color`, 'content.background', page)).toBeGreaterThanOrEqual(4.5);
        });

        it.each(['primary', 'secondary', 'success', 'info', 'warn', 'danger', 'contrast'])('%s tag meets WCAG AA', (severity) => {
            expect(contrast(map, `tag.${severity}.color`, `tag.${severity}.background`, page)).toBeGreaterThanOrEqual(4.5);
        });

        it.each(['primary', 'secondary', 'success', 'info', 'warn', 'danger', 'contrast'])('%s badge meets WCAG AA', (severity) => {
            expect(contrast(map, `badge.${severity}.color`, `badge.${severity}.background`, page)).toBeGreaterThanOrEqual(4.5);
        });

        it.each(['info', 'success', 'warn', 'error', 'secondary'])('%s message meets WCAG AA', (severity) => {
            expect(contrast(map, `message.${severity}.color`, `message.${severity}.background`, page)).toBeGreaterThanOrEqual(4.5);
        });

        it('selected date meets WCAG AA', () => {
            expect(contrast(map, 'datepicker.date.selected.color', 'datepicker.date.selected.background', page)).toBeGreaterThanOrEqual(4.5);
        });
    });
});
