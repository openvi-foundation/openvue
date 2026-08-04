/*
 * Everything the playground knows about chart configuration lives here rather than in the
 * components, so the panel stays presentational and the mapping from a control to a Chart.js
 * option can be read in one place.
 */

export const POINT_TYPES = ['scatter', 'bubble'];
export const CARTESIAN_TYPES = ['bar', 'line', 'scatter', 'bubble'];

/*
 * Chart.js gives these types an aspect ratio of 1 rather than the 2 a cartesian chart gets, so a
 * responsive canvas in a wide container grows as tall as it is wide. Capping the width is what the
 * rest of the chart examples do, and it keeps the generated code honest about needing the cap too.
 */
export const CIRCULAR_TYPES = ['pie', 'doughnut', 'polarArea', 'radar'];
export const CIRCULAR_CLASS = 'w-full md:w-[30rem]';

export const CHART_TYPES = [
    { label: 'Bar', value: 'bar' },
    { label: 'Line', value: 'line' },
    { label: 'Pie', value: 'pie' },
    { label: 'Doughnut', value: 'doughnut' },
    { label: 'Polar Area', value: 'polarArea' },
    { label: 'Radar', value: 'radar' },
    { label: 'Scatter', value: 'scatter' },
    { label: 'Bubble', value: 'bubble' }
];

export const LEGEND_POSITIONS = [
    { label: 'Top', value: 'top' },
    { label: 'Right', value: 'right' },
    { label: 'Bottom', value: 'bottom' },
    { label: 'Left', value: 'left' },
    { label: 'Hidden', value: 'none' }
];

export const TOOLTIP_MODES = [
    { label: 'Index', value: 'index' },
    { label: 'Nearest', value: 'nearest' },
    { label: 'Point', value: 'point' },
    { label: 'Dataset', value: 'dataset' }
];

export const MAX_SERIES = 8;

export const isPointType = (type) => POINT_TYPES.includes(type);
export const isCircular = (type) => CIRCULAR_TYPES.includes(type);
export const isCartesian = (type) => CARTESIAN_TYPES.includes(type);
export const pointFields = (type) => (type === 'bubble' ? ['x', 'y', 'r'] : ['x', 'y']);

const randomValue = () => Math.round(Math.random() * 700) + 50;
const randomPoint = () => ({ x: Math.round(Math.random() * 100), y: Math.round(Math.random() * 100), r: Math.round(Math.random() * 18) + 6 });

export { randomValue, randomPoint };

export const createDefaults = () => ({
    config: {
        type: 'bar',
        themed: true,
        title: '',
        legend: 'top',
        grid: true,
        stacked: false,
        horizontal: false,
        fill: false,
        tension: 0.4,
        cutout: 60,
        xTitle: '',
        yTitle: '',
        yMin: null,
        yMax: null,
        tooltipMode: 'index',
        animation: true
    },
    data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        series: [
            { label: 'Sales', values: [540, 325, 702, 620], points: [randomPoint(), randomPoint(), randomPoint(), randomPoint()] },
            { label: 'Returns', values: [120, 90, 145, 130], points: [randomPoint(), randomPoint(), randomPoint(), randomPoint()] }
        ]
    }
});

/**
 * Builds the Chart.js `data` object from the editable series.
 */
export function buildData(config, data) {
    if (isPointType(config.type)) {
        const fields = pointFields(config.type);

        return {
            datasets: data.series.map((series) => ({
                label: series.label,
                data: series.points.map((point) => Object.fromEntries(fields.map((field) => [field, point[field] ?? 0])))
            }))
        };
    }

    const fill = config.type === 'line' && config.fill;

    return {
        labels: [...data.labels],
        datasets: data.series.map((series) => ({
            label: series.label,
            data: data.labels.map((_, index) => series.values[index] ?? 0),
            ...(fill ? { fill: true } : {})
        }))
    };
}

/**
 * Builds the Chart.js `options` object from the control values. Only settings the user has actually
 * changed are emitted, so the generated code stays close to what someone would write by hand.
 */
export function buildOptions(config) {
    const { type, legend, grid, stacked, horizontal, tension, cutout, title, xTitle, yTitle, yMin, yMax, tooltipMode, animation } = config;

    const options = {
        plugins: {
            legend: legend === 'none' ? { display: false } : { display: true, position: legend },
            tooltip: { mode: tooltipMode, intersect: tooltipMode === 'nearest' || tooltipMode === 'point' }
        }
    };

    if (title) options.plugins.title = { display: true, text: title };
    if (!animation) options.animation = false;

    if (isCartesian(type)) {
        const x = { grid: { display: grid && horizontal }, stacked };
        const y = { grid: { display: grid && !horizontal }, stacked };

        if (xTitle) x.title = { display: true, text: xTitle };
        if (yTitle) y.title = { display: true, text: yTitle };
        if (yMin !== null && yMin !== undefined) y.min = yMin;
        if (yMax !== null && yMax !== undefined) y.max = yMax;

        options.scales = { x, y };
    }

    if (type === 'bar' && horizontal) options.indexAxis = 'y';
    if (type === 'line') options.elements = { line: { tension } };
    if (type === 'doughnut') options.cutout = `${cutout}%`;

    return options;
}

/**
 * Parses the advanced options textarea. Returns the parsed object and an error message, so the
 * caller never has to parse the same string twice to learn both.
 */
export function parseAdvanced(source) {
    if (!source || !source.trim()) return { value: null, error: null };

    try {
        const parsed = JSON.parse(source);

        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            return { value: null, error: 'Options must be a JSON object.' };
        }

        return { value: parsed, error: null };
    } catch (error) {
        return { value: null, error: `Not valid JSON: ${error.message}` };
    }
}
