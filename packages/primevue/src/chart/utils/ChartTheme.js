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
    { light: 'blue.500', dark: 'blue.500', fallback: '#3b82f6' },
    { light: 'amber.500', dark: 'amber.600', fallback: '#f59e0b' },
    { light: 'violet.500', dark: 'violet.500', fallback: '#8b5cf6' },
    { light: 'emerald.500', dark: 'emerald.600', fallback: '#10b981' },
    { light: 'fuchsia.500', dark: 'fuchsia.500', fallback: '#d946ef' },
    { light: 'rose.500', dark: 'rose.500', fallback: '#f43f5e' },
    { light: 'cyan.500', dark: 'cyan.600', fallback: '#06b6d4' },
    { light: 'lime.500', dark: 'lime.600', fallback: '#84cc16' }
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
export function getChartTheme(element, type, datasetCount = 0) {
    if (typeof window === 'undefined' || !element) return null;

    try {
        const styles = getComputedStyle(element);
        const text = resolve(styles, SEMANTIC_TOKENS.text);

        if (!text) return null;

        const textMuted = resolve(styles, SEMANTIC_TOKENS.textMuted) || text;
        const border = resolve(styles, SEMANTIC_TOKENS.border);
        const background = resolve(styles, SEMANTIC_TOKENS.background);
        const scheme = isDarkSurface(background) ? 'dark' : 'light';
        const fontFamily = styles.fontFamily;

        /*
         * A slot that cannot be resolved keeps its position and falls back to the light step.
         * Dropping it instead would shift every later series onto the wrong colour.
         */
        const palette = SERIES_TOKENS.map((slot) => resolve(styles, slot[scheme]) || resolve(styles, slot.light) || slot.fallback);

        const options = {
            plugins: {
                /*
                 * A legend is the secondary encoding that keeps series identifiable when a fill
                 * does not clear contrast against the surface. Small point-style swatches keep it
                 * from competing with the plot.
                 */
                legend: {
                    /*
                     * With one series the title or surrounding copy already names it, so a legend
                     * would repeat a single label. Types coloured per data point always keep it,
                     * since there the legend carries the identity of each slice.
                     */
                    display: datasetCount > 1 || PER_POINT.includes(type),
                    labels: {
                        color: text,
                        font: { family: fontFamily, size: 12 },
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 16
                    }
                },
                tooltip: {
                    titleColor: text,
                    bodyColor: textMuted,
                    backgroundColor: background,
                    borderColor: border,
                    borderWidth: 1,
                    titleFont: { family: fontFamily, size: 12, weight: 600 },
                    bodyFont: { family: fontFamily, size: 12 },
                    padding: 12,
                    cornerRadius: 6,
                    boxPadding: 6,
                    usePointStyle: true
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
const PER_POINT = ['pie', 'doughnut', 'polarArea'];

function getScales(type, { textMuted, border, fontFamily }) {
    const ticks = { color: textMuted, font: { family: fontFamily, size: 12 }, padding: 8 };

    if (CARTESIAN.includes(type)) {
        /*
         * Grid and axes stay recessive so the data reads first. Only the value axis keeps its
         * lines: a grid in both directions boxes the plot in without adding information.
         */
        return {
            x: {
                ticks,
                grid: { display: false },
                border: { display: false }
            },
            y: {
                ticks,
                grid: { color: border, drawTicks: false },
                border: { display: false }
            }
        };
    }

    if (RADIAL.includes(type)) {
        return {
            r: {
                ticks: { ...ticks, backdropColor: 'transparent', showLabelBackdrop: false },
                grid: { color: border },
                angleLines: { color: border },
                pointLabels: { color: textMuted, font: { family: fontFamily, size: 12 } }
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

    const perPoint = PER_POINT.includes(type);

    return {
        ...data,
        datasets: data.datasets.map((dataset, index) => {
            const next = { ...dataset };
            const color = palette[index % palette.length];
            const set = (key, value) => {
                if (next[key] === undefined) next[key] = value;
            };

            if (perPoint) {
                set(
                    'backgroundColor',
                    (dataset.data || []).map((_, i) => palette[i % palette.length])
                );
                /*
                 * A ring in the surface colour separates adjacent slices without a visible stroke.
                 */
                set('borderColor', 'transparent');
                set('borderWidth', 2);

                return next;
            }

            const filled = dataset.fill || type === 'radar';

            set('backgroundColor', filled ? withAlpha(color, 0.2) : color);
            set('borderColor', color);

            if (type === 'bar') {
                // rounded at the data end, flat where the bar meets the baseline
                set('borderRadius', 4);
                set('borderSkipped', 'start');
                set('maxBarThickness', 48);
            } else {
                set('borderWidth', 2);
                /*
                 * Points stay hidden until hover so a dense series reads as a line, but the hit
                 * area is kept well above the mark size so they remain easy to target.
                 */
                set('pointRadius', 0);
                set('pointHoverRadius', 4);
                set('pointHitRadius', 12);
                set('pointBackgroundColor', color);
                set('pointBorderColor', color);
            }

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
