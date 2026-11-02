import { palette } from '@openvue/themes';

export const BASES = [
    { value: 'Aura', description: 'The balanced default.' },
    { value: 'Lara', description: 'Rounded and friendly.' },
    { value: 'Nora', description: 'Sharp and corporate.' },
    { value: 'Material', description: 'Material Design flavour.' },
    { value: 'Nide', description: 'Neutral and minimal.' }
];

export const PRIMARY_COLORS = ['noir', 'emerald', 'green', 'lime', 'orange', 'amber', 'yellow', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'];

export const SURFACES = {
    slate: { 0: '#ffffff', 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617' },
    gray: { 0: '#ffffff', 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827', 950: '#030712' },
    zinc: { 0: '#ffffff', 50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8', 400: '#a1a1aa', 500: '#71717a', 600: '#52525b', 700: '#3f3f46', 800: '#27272a', 900: '#18181b', 950: '#09090b' },
    neutral: { 0: '#ffffff', 50: '#fafafa', 100: '#f5f5f5', 200: '#e5e5e5', 300: '#d4d4d4', 400: '#a3a3a3', 500: '#737373', 600: '#525252', 700: '#404040', 800: '#262626', 900: '#171717', 950: '#0a0a0a' },
    stone: { 0: '#ffffff', 50: '#fafaf9', 100: '#f5f5f4', 200: '#e7e5e4', 300: '#d6d3d1', 400: '#a8a29e', 500: '#78716c', 600: '#57534e', 700: '#44403c', 800: '#292524', 900: '#1c1917', 950: '#0c0a09' },
    soho: { 0: '#ffffff', 50: '#ececec', 100: '#dedfdf', 200: '#c4c4c6', 300: '#adaeb0', 400: '#97979b', 500: '#7f8084', 600: '#6a6b70', 700: '#55565b', 800: '#3f4046', 900: '#2c2c34', 950: '#16161d' },
    viva: { 0: '#ffffff', 50: '#f3f3f3', 100: '#e7e7e8', 200: '#cfd0d0', 300: '#b7b8b9', 400: '#9fa1a1', 500: '#87898a', 600: '#6e7173', 700: '#565a5b', 800: '#3e4244', 900: '#262b2c', 950: '#0e1315' },
    ocean: { 0: '#ffffff', 50: '#fbfcfc', 100: '#F7F9F8', 200: '#EFF3F2', 300: '#DADEDD', 400: '#B1B7B6', 500: '#828787', 600: '#5F7274', 700: '#415B61', 800: '#29444E', 900: '#183240', 950: '#0c1920' }
};

export const FONTS = [
    'Inter var',
    'Albert Sans',
    'DM Sans',
    'Figtree',
    'Geist',
    'IBM Plex Sans',
    'Instrument Sans',
    'Lexend',
    'Manrope',
    'Montserrat',
    'Nunito',
    'Onest',
    'Outfit',
    'Plus Jakarta Sans',
    'Poppins',
    'Public Sans',
    'Quicksand',
    'Roboto',
    'Rubik',
    'Space Grotesk'
];

export const DENSITIES = { compact: 0.75, default: 1, roomy: 1.25 };

export const FOCUS_RINGS = {
    hairline: { width: '1px', offset: '2px' },
    bold: { width: '2px', offset: '2px' },
    tight: { width: '2px', offset: '0' }
};

export const MOTIONS = { off: '0s', fast: '0.1s', slow: '0.3s' };

export const SHADOWS = {
    flat: { overlay: 'none', modal: 'none', card: 'none' },
    soft: {
        overlay: '0 2px 8px -2px rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        modal: '0 12px 32px -8px rgba(0, 0, 0, 0.2)',
        card: '0 1px 2px 0 rgba(0, 0, 0, 0.06)'
    },
    deep: {
        overlay: '0 12px 24px -6px rgba(0, 0, 0, 0.22), 0 4px 8px -2px rgba(0, 0, 0, 0.12)',
        modal: '0 28px 56px -12px rgba(0, 0, 0, 0.38)',
        card: '0 10px 24px -6px rgba(0, 0, 0, 0.14), 0 2px 6px 0 rgba(0, 0, 0, 0.08)'
    }
};

export const MASKS = {
    light: { light: 'rgba(0, 0, 0, 0.2)', dark: 'rgba(0, 0, 0, 0.4)' },
    dark: { light: 'rgba(0, 0, 0, 0.6)', dark: 'rgba(0, 0, 0, 0.8)' }
};

export const DISABLED_MIN = 0.3;
export const DISABLED_MAX = 0.8;

const HEX_COLOR = /^#[0-9a-f]{6}$/;
const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export function isCustomColor(value) {
    return typeof value === 'string' && HEX_COLOR.test(value);
}

export function swatchColor(primary) {
    if (isCustomColor(primary)) return primary;

    return primary === 'noir' ? 'var(--text-color)' : `var(--p-${primary}-500)`;
}

export function primaryPalette(primary) {
    if (isCustomColor(primary)) {
        return palette(primary);
    }

    const source = primary === 'noir' ? 'surface' : primary;

    return Object.fromEntries(SHADES.map((shade) => [shade, `{${source}.${shade}}`]));
}

// Mirrors the documentation configurator, so a recipe matches the configurator's choice.
export function primaryScheme(base, primary) {
    const noir = primary === 'noir';

    if (base === 'Nide') {
        // Selections stay neutral in Nide.
        return {
            light: {
                primary: noir
                    ? { color: '{primary.900}', contrastColor: '{primary.50}', hoverColor: '{primary.800}', activeColor: '{primary.700}' }
                    : { color: '{primary.600}', contrastColor: '#ffffff', hoverColor: '{primary.700}', activeColor: '{primary.800}' },
                highlight: { background: '{surface.100}', focusBackground: '{surface.200}', color: '{surface.900}', focusColor: '{surface.900}' }
            },
            dark: {
                primary: noir
                    ? { color: '{primary.200}', contrastColor: '{primary.900}', hoverColor: '{primary.300}', activeColor: '{primary.400}' }
                    : { color: '{primary.400}', contrastColor: '{surface.950}', hoverColor: '{primary.300}', activeColor: '{primary.200}' },
                highlight: { background: '{surface.800}', focusBackground: '{surface.700}', color: '{surface.50}', focusColor: '{surface.50}' }
            }
        };
    }

    if (noir) {
        return {
            light: {
                primary: { color: '{primary.950}', contrastColor: '#ffffff', hoverColor: '{primary.800}', activeColor: '{primary.700}' },
                highlight: { background: '{primary.950}', focusBackground: '{primary.700}', color: '#ffffff', focusColor: '#ffffff' }
            },
            dark: {
                primary: { color: '{primary.50}', contrastColor: '{primary.950}', hoverColor: '{primary.200}', activeColor: '{primary.300}' },
                highlight: { background: '{primary.50}', focusBackground: '{primary.300}', color: '{primary.950}', focusColor: '{primary.950}' }
            }
        };
    }

    if (base === 'Nora') {
        return {
            light: {
                primary: { color: '{primary.600}', contrastColor: '#ffffff', hoverColor: '{primary.700}', activeColor: '{primary.800}' },
                highlight: { background: '{primary.600}', focusBackground: '{primary.700}', color: '#ffffff', focusColor: '#ffffff' }
            },
            dark: {
                primary: { color: '{primary.500}', contrastColor: '{surface.900}', hoverColor: '{primary.400}', activeColor: '{primary.300}' },
                highlight: { background: '{primary.500}', focusBackground: '{primary.400}', color: '{surface.900}', focusColor: '{surface.900}' }
            }
        };
    }

    const dark = {
        primary: { color: '{primary.400}', contrastColor: '{surface.900}', hoverColor: '{primary.300}', activeColor: '{primary.200}' },
        highlight: {
            background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
            focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
            color: 'rgba(255,255,255,.87)',
            focusColor: 'rgba(255,255,255,.87)'
        }
    };

    if (base === 'Material') {
        return {
            light: {
                primary: { color: '{primary.500}', contrastColor: '#ffffff', hoverColor: '{primary.400}', activeColor: '{primary.300}' },
                highlight: {
                    background: 'color-mix(in srgb, {primary.color}, transparent 88%)',
                    focusBackground: 'color-mix(in srgb, {primary.color}, transparent 76%)',
                    color: '{primary.700}',
                    focusColor: '{primary.800}'
                }
            },
            dark
        };
    }

    return {
        light: {
            primary: { color: '{primary.500}', contrastColor: '#ffffff', hoverColor: '{primary.600}', activeColor: '{primary.700}' },
            highlight: { background: '{primary.50}', focusBackground: '{primary.100}', color: '{primary.700}', focusColor: '{primary.800}' }
        },
        dark
    };
}

function toPixels(value) {
    if (value === '0' || value === 0) return 0;

    const match = /^(\d*\.?\d+)px$/.exec(String(value).trim());

    return match ? Number(match[1]) : NaN;
}

export function scaleRadius(baseRadius, target) {
    const medium = toPixels(baseRadius.md);
    const factor = medium > 0 ? target / medium : 0;
    const scaled = {};

    for (const [key, value] of Object.entries(baseRadius)) {
        const pixels = toPixels(value);

        if (key === 'none' || Number.isNaN(pixels)) {
            scaled[key] = value;
        } else {
            const result = Math.round(pixels * factor);

            scaled[key] = result === 0 ? '0' : result + 'px';
        }
    }

    return scaled;
}

export function scaleSpacing(value, factor) {
    return String(value)
        .trim()
        .split(/\s+/)
        .map((part) => {
            const match = /^(\d*\.?\d+)(rem|px|em)$/.exec(part);

            if (!match) return part;

            const unit = match[2];
            const scaled = Number(match[1]) * factor;
            const rounded = unit === 'px' ? Math.round(scaled) : Math.round(scaled * 10000) / 10000;

            return rounded + unit;
        })
        .join(' ');
}

// The only components whose own tokens a recipe changes; everything else is primitive or semantic.
export const RECIPE_COMPONENTS = ['button', 'card', 'inputgroup', 'togglebutton'];

const DENSITY_PATHS = [
    'semantic.formField.paddingX',
    'semantic.formField.paddingY',
    'semantic.formField.sm.paddingX',
    'semantic.formField.sm.paddingY',
    'semantic.formField.lg.paddingX',
    'semantic.formField.lg.paddingY',
    'semantic.list.header.padding',
    'semantic.list.option.padding',
    'semantic.list.optionGroup.padding',
    'semantic.navigation.item.padding',
    'semantic.navigation.submenuLabel.padding',
    'components.button.root.paddingX',
    'components.button.root.paddingY',
    'components.button.root.sm.paddingX',
    'components.button.root.sm.paddingY',
    'components.button.root.lg.paddingX',
    'components.button.root.lg.paddingY',
    'components.inputgroup.addon.padding',
    'components.togglebutton.root.padding',
    'components.togglebutton.content.padding'
];

function readPath(source, path) {
    return path.split('.').reduce((node, key) => (node && typeof node === 'object' ? node[key] : undefined), source);
}

function writePath(target, path, value) {
    const keys = path.split('.');
    let node = target;

    for (const key of keys.slice(0, -1)) {
        node[key] = node[key] || {};
        node = node[key];
    }

    node[keys[keys.length - 1]] = value;
}

function luminance(hex) {
    const value = parseInt(hex.slice(1), 16);

    const channel = (shift) => {
        const c = ((value >> shift) & 255) / 255;

        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    };

    return 0.2126 * channel(16) + 0.7152 * channel(8) + 0.0722 * channel(0);
}

export function contrastRatio(a, b) {
    const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);

    return (light + 0.05) / (dark + 0.05);
}

function resolveColor(value, mode, primaries, surface, basePreset) {
    const match = /^\{(\w+)\.(\d+)\}$/.exec(value || '');

    if (!match) return value;

    const [, name, shade] = match;

    if (name === 'primary') return primaries[shade];

    if (name === 'surface') {
        const surfaces = SURFACES[surface] || basePreset.semantic.colorScheme[mode].surface;

        return resolveColor(surfaces[shade], mode, primaries, surface, basePreset);
    }

    return basePreset.primitive[name]?.[shade];
}

function shadeOf(reference) {
    const match = /^\{primary\.(\d+)\}$/.exec(reference || '');

    return match ? Number(match[1]) : null;
}

// Steps a custom colour away from its text colour until the pair passes WCAG AA; hover and active keep the base's offsets.
function accessibleAction(scheme, primaries, resolve, direction) {
    const text = String(resolve(scheme.contrastColor) || '').toLowerCase();
    const from = SHADES.indexOf(shadeOf(scheme.color));

    if (from < 0 || !isCustomColor(text)) return scheme;

    const offset = (key) => SHADES.indexOf(shadeOf(scheme[key])) - from;
    const clamp = (index) => SHADES[Math.min(SHADES.length - 1, Math.max(0, index))];
    let index = from;

    while (contrastRatio(primaries[SHADES[index]], text) < 4.5 && index + direction >= 0 && index + direction < SHADES.length) {
        index += direction;
    }

    return {
        ...scheme,
        color: `{primary.${SHADES[index]}}`,
        hoverColor: `{primary.${clamp(index + offset('hoverColor'))}}`,
        activeColor: `{primary.${clamp(index + offset('activeColor'))}}`
    };
}

export function buildPresetExt(recipe, basePreset) {
    const scheme = primaryScheme(recipe.base, recipe.primary);
    const primaries = primaryPalette(recipe.primary);
    const ext = {
        semantic: {
            primary: primaries,
            colorScheme: {
                light: { ...scheme.light },
                dark: { ...scheme.dark }
            }
        }
    };

    if (SURFACES[recipe.surface]) {
        ext.semantic.colorScheme.light.surface = { ...SURFACES[recipe.surface] };
        ext.semantic.colorScheme.dark.surface = { ...SURFACES[recipe.surface] };
    }

    if (isCustomColor(recipe.primary) && basePreset) {
        const resolve = (value, mode) => resolveColor(value, mode, primaries, recipe.surface, basePreset);

        ext.semantic.colorScheme.light.primary = accessibleAction(scheme.light.primary, primaries, (value) => resolve(value, 'light'), 1);
        ext.semantic.colorScheme.dark.primary = accessibleAction(scheme.dark.primary, primaries, (value) => resolve(value, 'dark'), -1);

        // Nora fills selections with fixed primary shades; follow the accessible action instead.
        if (recipe.base === 'Nora') {
            const solid = { background: '{primary.color}', focusBackground: '{primary.hover.color}', color: '{primary.contrast.color}', focusColor: '{primary.contrast.color}' };

            ext.semantic.colorScheme.light.highlight = { ...solid };
            ext.semantic.colorScheme.dark.highlight = { ...solid };
        }
    }

    if (typeof recipe.radius === 'number' && basePreset?.primitive?.borderRadius) {
        ext.primitive = { borderRadius: scaleRadius(basePreset.primitive.borderRadius, recipe.radius) };
    }

    const factor = typeof recipe.density === 'number' ? recipe.density : (DENSITIES[recipe.density] ?? 1);

    if (factor !== 1) {
        for (const path of DENSITY_PATHS) {
            const value = readPath(basePreset, path);

            if (typeof value === 'string' && !value.includes('{')) {
                writePath(ext, path, scaleSpacing(value, factor));
            }
        }

        // Icon-only buttons have a fixed width; follow the height change so they stay square.
        for (const size of ['', 'sm.', 'lg.']) {
            const paddingY = readPath(basePreset, `semantic.formField.${size}paddingY`);
            const width = readPath(basePreset, `components.button.root.${size}iconOnlyWidth`);
            const paddingRem = /^(\d*\.?\d+)rem$/.exec(paddingY || '');
            const widthRem = /^(\d*\.?\d+)rem$/.exec(width || '');

            if (paddingRem && widthRem) {
                const delta = 2 * Number(paddingRem[1]) * (factor - 1);

                writePath(ext, `components.button.root.${size}iconOnlyWidth`, Math.round((Number(widthRem[1]) + delta) * 10000) / 10000 + 'rem');
            }
        }
    }

    const ring = FOCUS_RINGS[recipe.focus];

    if (ring) {
        const focusRing = { width: ring.width, style: 'solid', color: '{primary.color}', offset: ring.offset, shadow: 'none' };

        ext.semantic.focusRing = focusRing;

        // Fields with a literal ring width of their own (Nide's 3px) take the option's width and offset too.
        const fieldRing = basePreset?.semantic?.formField?.focusRing;

        if (fieldRing?.color === '{focus.ring.color}') {
            for (const key of ['width', 'offset']) {
                if (!String(fieldRing[key]).includes('{')) writePath(ext, `semantic.formField.focusRing.${key}`, ring[key]);
            }
        }

        // The engine writes colour scheme tokens after semantic ones, so ring keys a base sets per scheme are restated there.
        for (const scheme of ['light', 'dark']) {
            const own = basePreset?.semantic?.colorScheme?.[scheme]?.focusRing;

            if (own) {
                ext.semantic.colorScheme[scheme].focusRing = Object.fromEntries(
                    Object.keys(own)
                        .filter((key) => Object.hasOwn(focusRing, key))
                        .map((key) => [key, focusRing[key]])
                );
            }

            // Lara's buttons glow per severity with a transparent ring colour; give them the outline instead.
            for (const [severity, tokens] of Object.entries(basePreset?.components?.button?.colorScheme?.[scheme]?.root || {})) {
                const severityRing = tokens?.focusRing;

                if (severityRing && (severityRing.color === 'transparent' || (severityRing.shadow && severityRing.shadow !== 'none'))) {
                    writePath(ext, `components.button.colorScheme.${scheme}.root.${severity}.focusRing`, { color: severityRing.color === 'transparent' ? '{focus.ring.color}' : severityRing.color, shadow: 'none' });
                }
            }
        }
    }

    if (Object.hasOwn(MOTIONS, recipe.motion)) {
        ext.semantic.transitionDuration = MOTIONS[recipe.motion];
    }

    const shadow = SHADOWS[recipe.shadow];

    if (shadow) {
        ext.semantic.overlay = {
            select: { shadow: shadow.overlay },
            popover: { shadow: shadow.overlay },
            navigation: { shadow: shadow.overlay },
            modal: { shadow: shadow.modal }
        };
        writePath(ext, 'components.card.root.shadow', shadow.card);

        if (recipe.shadow === 'flat') {
            const border = { borderColor: '{content.border.color}' };

            for (const scheme of ['light', 'dark']) {
                ext.semantic.colorScheme[scheme].overlay = { select: { ...border }, popover: { ...border }, modal: { ...border } };
            }
        }
    }

    const mask = MASKS[recipe.mask];

    if (mask) {
        ext.semantic.colorScheme.light.mask = { background: mask.light };
        ext.semantic.colorScheme.dark.mask = { background: mask.dark };
    }

    if (typeof recipe.disabled === 'number') {
        ext.semantic.disabledOpacity = String(recipe.disabled);
    }

    return ext;
}

export function fontStack(font) {
    return `"${font}", sans-serif`;
}

export function googleFamily(font) {
    return font === 'Inter var' ? 'Inter' : font;
}

export const UI_WEIGHTS = [400, 500, 600, 700];

// Letters, digits and single spaces only, so the name is safe in a URL and in a quoted font-family.
export function isFontFamily(value) {
    return typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9 ]{0,48}$/.test(value) && !/ {2}| $/.test(value);
}

export function familyParameter(font) {
    return encodeURIComponent(googleFamily(font)).replace(/%20/g, '+');
}

// Google Fonts rejects a request for a weight the family does not have.
export function fontStylesheetUrl(font, weights = UI_WEIGHTS) {
    const usable = weights.filter((weight) => UI_WEIGHTS.includes(weight));

    return `https://fonts.googleapis.com/css2?family=${familyParameter(font)}:wght@${(usable.length ? usable : weights).join(';')}&display=swap`;
}
