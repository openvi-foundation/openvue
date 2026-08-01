import { $dt } from '@openuxkit/styled';

/**
 * Chart.js renders to a canvas, so it cannot consume `var(--p-*)` references the way the rest of
 * the library does. Token names are resolved through $dt so they stay correct across presets, then
 * read off the document to get concrete values the canvas can paint with.
 */

/*
 * Fixed categorical order. Slots are assigned by dataset index and never cycled or reordered, so a
 * series keeps its colour when other series are added or filtered out.
 *
 * Both rows were checked for the OKLCH lightness band, chroma floor, adjacent colour-vision
 * separation and contrast against their own surface. Dark is a separate selection rather than a
 * lightened copy of light, because simply brightening these hues pushes them out of the band.
 */
const SERIES_TOKENS = [
    { light: 'blue.500', dark: 'blue.500' },
    { light: 'amber.500', dark: 'amber.600' },
    { light: 'violet.500', dark: 'violet.500' },
    { light: 'emerald.500', dark: 'emerald.600' },
    { light: 'fuchsia.500', dark: 'fuchsia.500' },
    { light: 'rose.500', dark: 'rose.500' },
    { light: 'cyan.500', dark: 'cyan.600' },
    { light: 'lime.500', dark: 'lime.600' }
];

const SEMANTIC_TOKENS = {
    text: 'text.color',
    textMuted: 'text.muted.color',
    border: 'content.border.color',
    background: 'content.background'
};

const resolve = (styles, token) => styles.getPropertyValue($dt(token).name).trim();

/*
 * Derive the scheme from the resolved surface rather than from a class name or media query, so it
 * stays correct however the application happens to toggle dark mode.
 */
const isDarkSurface = (color) => {
    const parsed = parseColor(color);

    if (!parsed) return false;

    const [r, g, b] = parsed.map((channel) => {
        const c = channel / 255;

        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.5;
};

const parseColor = (value) => {
    if (!value) return null;

    const hex = value.match(/^#([\da-f]{3}|[\da-f]{6})$/i);

    if (hex) {
        const digits = hex[1].length === 3 ? [...hex[1]].map((d) => d + d) : hex[1].match(/../g);

        return digits.map((d) => parseInt(d, 16));
    }

    const rgb = value.match(/rgba?\(([^)]+)\)/i);

    if (rgb) {
        return rgb[1]
            .split(/[,\s/]+/)
            .slice(0, 3)
            .map(Number);
    }

    return null;
};

const withAlpha = (color, alpha) => {
    const parsed = parseColor(color);

    return parsed ? `rgba(${parsed[0]}, ${parsed[1]}, ${parsed[2]}, ${alpha})` : color;
};

/**
 * Reads the active theme off the given element and returns the palette plus a Chart.js options
 * skeleton. Returns null when nothing resolves, which is the case in non-browser environments.
 */
export function getChartTheme(element, type) {
    if (typeof window === 'undefined' || !element) return null;

    try {
        const styles = getComputedStyle(element);
        const text = resolve(styles, SEMANTIC_TOKENS.text);

        if (!text) return null;

        const textMuted = resolve(styles, SEMANTIC_TOKENS.textMuted) || text;
        const border = resolve(styles, SEMANTIC_TOKENS.border);
        const background = resolve(styles, SEMANTIC_TOKENS.background);
        const scheme = isDarkSurface(background) ? 'dark' : 'light';
        const palette = SERIES_TOKENS.map((slot) => resolve(styles, slot[scheme])).filter(Boolean);
        const fontFamily = styles.fontFamily;

        const options = {
            /*
             * A legend is the secondary encoding that keeps series identifiable when the fill
             * alone does not clear contrast against the surface.
             */
            plugins: {
                legend: {
                    labels: { color: text, font: { family: fontFamily } }
                },
                tooltip: {
                    titleColor: text,
                    bodyColor: textMuted,
                    backgroundColor: background,
                    borderColor: border,
                    borderWidth: 1,
                    titleFont: { family: fontFamily },
                    bodyFont: { family: fontFamily }
                }
            }
        };

        const scales = getScales(type, { textMuted, border, fontFamily });

        if (scales) options.scales = scales;

        return { scheme, palette, text, textMuted, border, options };
    } catch (error) {
        /*
         * Theming is an enhancement, so a token that cannot be resolved must never stop the
         * chart from rendering. Fall back to Chart.js defaults instead.
         */
        return null;
    }
}

/*
 * Scale shape is per chart type. Radial types carry a single `r` scale and the circular types
 * have no scales at all, so a cartesian x/y pair would draw axes that do not belong there.
 */
const CARTESIAN = ['bar', 'line', 'scatter', 'bubble'];
const RADIAL = ['radar', 'polarArea'];

function getScales(type, { textMuted, border, fontFamily }) {
    const ticks = { color: textMuted, font: { family: fontFamily } };

    if (CARTESIAN.includes(type)) {
        const axis = { ticks, grid: { color: border }, border: { color: border } };

        return { x: { ...axis }, y: { ...axis } };
    }

    if (RADIAL.includes(type)) {
        return {
            r: {
                ticks: { ...ticks, backdropColor: 'transparent' },
                grid: { color: border },
                angleLines: { color: border },
                pointLabels: { color: textMuted, font: { family: fontFamily } }
            }
        };
    }

    return null;
}

/**
 * Applies palette slots to any dataset that has not set its own colours. Radial types read their
 * colours per data point rather than per dataset, so they receive an array instead of a scalar.
 */
export function applyPalette(data, type, palette) {
    if (!data || !Array.isArray(data.datasets) || !palette.length) return data;

    const perPoint = type === 'pie' || type === 'doughnut' || type === 'polarArea';

    return {
        ...data,
        datasets: data.datasets.map((dataset, index) => {
            const next = { ...dataset };
            const color = palette[index % palette.length];

            if (perPoint) {
                const colors = (dataset.data || []).map((_, i) => palette[i % palette.length]);

                if (next.backgroundColor === undefined) next.backgroundColor = colors;

                return next;
            }

            const filled = dataset.fill || type === 'bar' || type === 'radar';

            if (next.backgroundColor === undefined) next.backgroundColor = filled && type !== 'bar' ? withAlpha(color, 0.2) : color;
            if (next.borderColor === undefined) next.borderColor = color;

            return next;
        })
    };
}

/**
 * Merges token defaults underneath user supplied options. Anything the user sets wins, including
 * a value nested several levels down, so existing configurations keep working unchanged.
 */
export function mergeOptions(defaults, options) {
    if (!options) return defaults;
    if (!defaults) return options;

    const merged = { ...defaults };

    for (const key of Object.keys(options)) {
        const value = options[key];
        const base = defaults[key];
        const mergeable = value && base && typeof value === 'object' && typeof base === 'object' && !Array.isArray(value) && !Array.isArray(base);

        merged[key] = mergeable ? mergeOptions(base, value) : value;
    }

    return merged;
}
