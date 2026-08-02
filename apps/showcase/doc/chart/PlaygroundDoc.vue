<template>
    <div class="doc-main">
        <div class="doc-intro">
            <h1>Chart Playground</h1>
            <p>Build a chart by changing the controls, editing the data, and copying the generated code.</p>
        </div>

        <div class="doc-section-description">
            <p>
                Every control maps to a real Chart.js setting, so the generated code is what you would write by hand. Controls change with the chart type, since an option like <i>cutout</i> belongs to a doughnut and <i>stacked</i> belongs to a bar.
            </p>
            <p>Turn <i>themed</i> off to see what Chart.js renders on its own, and back on to see what OpenVue derives from the active theme. Switching the theme or dark mode while it is on updates the chart without any code on your side.</p>
        </div>

        <div class="card">
            <div class="flex flex-col gap-4 lg:flex-row">
                <div class="min-w-0 flex-1">
                    <Chart :type="config.type" :data="chartData" :options="chartOptions" :themed="config.themed" class="w-full" style="min-height: 22rem" />
                </div>

                <aside class="w-full shrink-0 lg:w-72" aria-label="Chart options">
                    <div class="rounded-border border border-surface">
                        <div class="flex flex-col gap-3 p-4">
                            <p class="text-xs font-semibold uppercase tracking-wider text-muted-color">Chart</p>

                            <div class="flex items-center justify-between gap-3">
                                <label for="pg-type" class="text-sm">Type</label>
                                <Select id="pg-type" v-model="config.type" :options="chartTypes" optionLabel="label" optionValue="value" size="small" class="w-36" />
                            </div>

                            <div class="flex items-center justify-between gap-3">
                                <label for="pg-themed" class="text-sm">Themed</label>
                                <ToggleSwitch id="pg-themed" v-model="config.themed" />
                            </div>

                            <div class="flex items-center justify-between gap-3">
                                <label for="pg-title" class="text-sm">Title</label>
                                <InputText id="pg-title" v-model="config.title" size="small" class="w-36" placeholder="None" />
                            </div>
                        </div>

                        <div class="flex flex-col gap-3 border-t border-surface p-4">
                            <p class="text-xs font-semibold uppercase tracking-wider text-muted-color">Presentation</p>

                            <div class="flex items-center justify-between gap-3">
                                <label for="pg-legend" class="text-sm">Legend</label>
                                <Select id="pg-legend" v-model="config.legend" :options="legendPositions" optionLabel="label" optionValue="value" size="small" class="w-36" />
                            </div>

                            <div v-if="isCartesian" class="flex items-center justify-between gap-3">
                                <label for="pg-grid" class="text-sm">Grid lines</label>
                                <ToggleSwitch id="pg-grid" v-model="config.grid" />
                            </div>

                            <template v-if="config.type === 'bar'">
                                <div class="flex items-center justify-between gap-3">
                                    <label for="pg-stacked" class="text-sm">Stacked</label>
                                    <ToggleSwitch id="pg-stacked" v-model="config.stacked" />
                                </div>
                                <div class="flex items-center justify-between gap-3">
                                    <label for="pg-horizontal" class="text-sm">Horizontal</label>
                                    <ToggleSwitch id="pg-horizontal" v-model="config.horizontal" />
                                </div>
                            </template>

                            <template v-if="config.type === 'line'">
                                <div class="flex items-center justify-between gap-3">
                                    <label for="pg-fill" class="text-sm">Fill area</label>
                                    <ToggleSwitch id="pg-fill" v-model="config.fill" />
                                </div>
                                <div class="flex flex-col gap-2 pt-1">
                                    <div class="flex items-center justify-between gap-3">
                                        <label for="pg-tension" class="text-sm">Curve</label>
                                        <span class="text-sm tabular-nums text-muted-color">{{ config.tension }}</span>
                                    </div>
                                    <Slider id="pg-tension" v-model="config.tension" :min="0" :max="0.5" :step="0.05" />
                                </div>
                            </template>

                            <div v-if="config.type === 'doughnut'" class="flex flex-col gap-2 pt-1">
                                <div class="flex items-center justify-between gap-3">
                                    <label for="pg-cutout" class="text-sm">Cutout</label>
                                    <span class="text-sm tabular-nums text-muted-color">{{ config.cutout }}%</span>
                                </div>
                                <Slider id="pg-cutout" v-model="config.cutout" :min="0" :max="90" :step="5" />
                            </div>
                        </div>

                        <div v-if="isCartesian" class="flex flex-col gap-3 border-t border-surface p-4">
                            <p class="text-xs font-semibold uppercase tracking-wider text-muted-color">Axes</p>

                            <div class="flex items-center justify-between gap-3">
                                <label for="pg-xtitle" class="text-sm">X title</label>
                                <InputText id="pg-xtitle" v-model="config.xTitle" size="small" class="w-36" placeholder="None" />
                            </div>

                            <div class="flex items-center justify-between gap-3">
                                <label for="pg-ytitle" class="text-sm">Y title</label>
                                <InputText id="pg-ytitle" v-model="config.yTitle" size="small" class="w-36" placeholder="None" />
                            </div>

                            <div class="flex items-center justify-between gap-3">
                                <label for="pg-ymin" class="text-sm">Y min</label>
                                <InputNumber id="pg-ymin" v-model="config.yMin" size="small" fluid class="w-36 shrink-0" placeholder="Auto" />
                            </div>

                            <div class="flex items-center justify-between gap-3">
                                <label for="pg-ymax" class="text-sm">Y max</label>
                                <InputNumber id="pg-ymax" v-model="config.yMax" size="small" fluid class="w-36 shrink-0" placeholder="Auto" />
                            </div>
                        </div>

                        <div class="flex flex-col gap-3 border-t border-surface p-4">
                            <p class="text-xs font-semibold uppercase tracking-wider text-muted-color">Behaviour</p>

                            <div class="flex items-center justify-between gap-3">
                                <label for="pg-tooltip" class="text-sm">Tooltip</label>
                                <Select id="pg-tooltip" v-model="config.tooltipMode" :options="tooltipModes" optionLabel="label" optionValue="value" size="small" class="w-36" />
                            </div>

                            <div class="flex items-center justify-between gap-3">
                                <label for="pg-animation" class="text-sm">Animation</label>
                                <ToggleSwitch id="pg-animation" v-model="config.animation" />
                            </div>
                        </div>

                        <div class="flex justify-end border-t border-surface px-4 py-3">
                            <Button label="Reset" severity="secondary" text size="small" @click="reset" />
                        </div>
                    </div>
                </aside>
            </div>
        </div>

        <h2 class="doc-section-label">Data</h2>
        <div class="doc-section-description">
            <p v-if="isPointType">
                Scatter and bubble charts plot coordinates rather than categories, so each point carries an <i>x</i> and <i>y</i><span v-if="config.type === 'bubble'"> and a radius <i>r</i></span
                >. Each series becomes one dataset and keeps its color by position.
            </p>
            <p v-else>
                Labels become the categories along the axis, and each series becomes one dataset. Series colors are assigned by position from a fixed palette, so a series keeps its color when others are added or removed. The palette holds eight
                colors; beyond that it repeats.
            </p>
        </div>

        <div class="card">
            <div class="overflow-x-auto pb-1">
                <!-- point types carry one column group per series, category types a single value column -->
                <div class="grid w-fit items-center gap-x-3 gap-y-2" :style="gridColumns" role="group" aria-label="Chart data">
                    <span class="text-xs font-semibold uppercase tracking-wider text-muted-color">{{ isPointType ? '#' : 'Label' }}</span>

                    <div v-for="(series, s) in data.series" :key="`h${s}`" class="flex min-w-0 items-center gap-2" :style="isPointType ? { gridColumn: `span ${pointFields.length}` } : null">
                        <span class="size-2.5 shrink-0 rounded-full" :style="{ backgroundColor: swatch(s) }" aria-hidden="true"></span>
                        <InputText v-model="series.label" size="small" fluid class="min-w-0" :aria-label="`Name of series ${s + 1}`" />
                        <Button icon="pi pi-times" text rounded severity="secondary" size="small" :disabled="data.series.length === 1" :aria-label="`Remove series ${s + 1}`" @click="removeSeries(s)" />
                    </div>

                    <Button icon="pi pi-plus" text rounded severity="secondary" size="small" :disabled="data.series.length >= 8" aria-label="Add series" @click="addSeries" />

                    <template v-if="isPointType">
                        <span></span>
                        <template v-for="(series, s) in data.series" :key="`f${s}`">
                            <span v-for="field in pointFields" :key="`f${s}${field}`" class="text-xs uppercase tracking-wider text-muted-color">{{ field }}</span>
                        </template>
                        <span></span>
                    </template>

                    <template v-for="(row, r) in rowCount" :key="r">
                        <template v-if="isPointType">
                            <span class="text-sm tabular-nums text-muted-color">{{ r + 1 }}</span>
                            <template v-for="(series, s) in data.series" :key="`p${r}${s}`">
                                <InputNumber v-for="field in pointFields" :key="`p${r}${s}${field}`" v-model="series.points[r][field]" size="small" fluid :aria-label="`${series.label} point ${r + 1} ${field}`" />
                            </template>
                        </template>
                        <template v-else>
                            <InputText v-model="data.labels[r]" size="small" fluid :aria-label="`Label for row ${r + 1}`" />
                            <InputNumber v-for="(series, s) in data.series" :key="`${r}-${s}`" v-model="series.values[r]" size="small" fluid :aria-label="`${series.label} at ${data.labels[r]}`" />
                        </template>
                        <Button icon="pi pi-times" text rounded severity="secondary" size="small" :disabled="rowCount === 1" :aria-label="`Remove row ${r + 1}`" @click="removeRow(r)" />
                    </template>
                </div>
            </div>

            <div class="mt-4 flex flex-wrap items-center gap-2 border-t border-surface pt-4">
                <Button :label="isPointType ? 'Add point' : 'Add row'" icon="pi pi-plus" size="small" severity="secondary" outlined @click="addRow" />
            </div>
        </div>

        <h2 class="doc-section-label">Advanced options</h2>
        <div class="doc-section-description">
            <p>
                The controls above cover the common settings. Chart.js has many more, so anything written here is merged over them and applied live. This is also the precedence rule the component follows: whatever you pass in
                <i>options</i> wins over the values derived from the theme. See the <a href="https://www.chartjs.org/docs/latest/general/options.html" target="_blank" rel="noopener noreferrer">Chart.js options reference</a> for the full surface.
            </p>
        </div>

        <div class="card">
            <Textarea v-model="advanced" rows="6" class="w-full font-mono text-sm" spellcheck="false" aria-label="Additional Chart.js options as JSON" placeholder='{ "plugins": { "subtitle": { "display": true, "text": "2026" } } }' />
            <Message v-if="advancedError" severity="error" size="small" variant="simple" class="mt-2">{{ advancedError }}</Message>
        </div>

        <h2 class="doc-section-label">Generated code</h2>
        <div class="doc-section-description">
            <p>The complete component for the chart above, ready to paste into your application. Switch between the Composition and Options API with the buttons, copy it with the copy button, or open it in StackBlitz to run it straight away.</p>
        </div>

        <DocSectionCode :code="code" :dependencies="{ 'chart.js': '4.5.0' }" component="Chart" fullCode />

        <h2 class="doc-section-label">What charts can and cannot do</h2>
        <div class="doc-section-description">
            <p>
                Chart is a wrapper around Chart.js, so its capabilities are Chart.js capabilities. It renders to a canvas, which means the marks cannot be styled with CSS or targeted with pass through options the way other components can. Anything
                visual is configured through <i>options</i> rather than through classes.
            </p>
            <p>
                Interaction is limited to what Chart.js provides: hover, tooltips and legend toggling. The <i>select</i> event reports the clicked element, and <i>getChart()</i> returns the underlying instance for anything not exposed as a property.
                For charts beyond the built in types, register a Chart.js plugin through the <i>plugins</i> property.
            </p>
            <p>
                A chart mixing types, such as bars with a line over them, is built by setting <i>type</i> on the individual datasets rather than on the component. The playground keeps one type for every series, so see the Combo example for that case.
            </p>
        </div>
    </div>
</template>

<script>
const PALETTE = ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#d946ef', '#f43f5e', '#06b6d4', '#84cc16'];
const POINT_TYPES = ['scatter', 'bubble'];

const randomPoint = () => ({ x: Math.round(Math.random() * 100), y: Math.round(Math.random() * 100), r: Math.round(Math.random() * 18) + 6 });

const defaults = () => ({
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

export default {
    data() {
        const { config, data } = defaults();

        return {
            config,
            data,
            advanced: '',
            chartTypes: [
                { label: 'Bar', value: 'bar' },
                { label: 'Line', value: 'line' },
                { label: 'Pie', value: 'pie' },
                { label: 'Doughnut', value: 'doughnut' },
                { label: 'Polar Area', value: 'polarArea' },
                { label: 'Radar', value: 'radar' },
                { label: 'Scatter', value: 'scatter' },
                { label: 'Bubble', value: 'bubble' }
            ],
            legendPositions: [
                { label: 'Top', value: 'top' },
                { label: 'Right', value: 'right' },
                { label: 'Bottom', value: 'bottom' },
                { label: 'Left', value: 'left' },
                { label: 'Hidden', value: 'none' }
            ],
            tooltipModes: [
                { label: 'Index', value: 'index' },
                { label: 'Nearest', value: 'nearest' },
                { label: 'Point', value: 'point' },
                { label: 'Dataset', value: 'dataset' }
            ]
        };
    },
    computed: {
        isPointType() {
            return POINT_TYPES.includes(this.config.type);
        },
        isCartesian() {
            return this.config.type === 'bar' || this.config.type === 'line' || this.isPointType;
        },
        pointFields() {
            return this.config.type === 'bubble' ? ['x', 'y', 'r'] : ['x', 'y'];
        },
        rowCount() {
            return this.isPointType ? this.data.series[0].points.length : this.data.labels.length;
        },
        gridColumns() {
            const perSeries = this.isPointType ? this.pointFields.length : 1;
            const width = this.isPointType ? '6rem' : '10rem';

            return { gridTemplateColumns: `9rem repeat(${this.data.series.length * perSeries}, ${width}) 2.5rem` };
        },
        chartData() {
            const fill = this.config.type === 'line' && this.config.fill;

            if (this.isPointType) {
                const fields = this.pointFields;

                return {
                    datasets: this.data.series.map((series) => ({
                        label: series.label,
                        data: series.points.map((p) => Object.fromEntries(fields.map((f) => [f, p[f] ?? 0])))
                    }))
                };
            }

            return {
                labels: [...this.data.labels],
                datasets: this.data.series.map((series) => ({
                    label: series.label,
                    data: this.data.labels.map((_, i) => series.values[i] ?? 0),
                    ...(fill ? { fill: true } : {})
                }))
            };
        },
        controlOptions() {
            const { type, legend, grid, stacked, horizontal, tension, cutout, title, xTitle, yTitle, yMin, yMax, tooltipMode, animation } = this.config;

            const options = {
                plugins: {
                    legend: legend === 'none' ? { display: false } : { display: true, position: legend },
                    tooltip: { mode: tooltipMode, intersect: tooltipMode === 'nearest' || tooltipMode === 'point' }
                }
            };

            if (title) options.plugins.title = { display: true, text: title };
            if (!animation) options.animation = false;

            if (this.isCartesian) {
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
        },
        advancedParsed() {
            if (!this.advanced.trim()) return null;

            try {
                const parsed = JSON.parse(this.advanced);

                return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
            } catch {
                return null;
            }
        },
        advancedError() {
            if (!this.advanced.trim()) return null;

            try {
                const parsed = JSON.parse(this.advanced);

                if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return 'Options must be a JSON object.';

                return null;
            } catch (error) {
                return `Not valid JSON: ${error.message}`;
            }
        },
        chartOptions() {
            return this.merge(this.controlOptions, this.advancedParsed);
        },
        code() {
            const datasets = this.data.series
                .map((series) => {
                    if (this.isPointType) {
                        const points = series.points.map((p) => `{ ${this.pointFields.map((f) => `${f}: ${p[f] ?? 0}`).join(', ')} }`).join(', ');

                        return `            {\n                label: '${series.label}',\n                data: [${points}]\n            }`;
                    }

                    const values = this.data.labels.map((_, i) => series.values[i] ?? 0);
                    const fill = this.config.type === 'line' && this.config.fill ? ',\n                fill: true' : '';

                    return `            {\n                label: '${series.label}',\n                data: [${values.join(', ')}]${fill}\n            }`;
                })
                .join(',\n');

            const labelsLine = this.isPointType ? '' : `\n                labels: [${this.data.labels.map((l) => `'${l}'`).join(', ')}],`;
            const optionsLiteral = this.stringify(this.chartOptions, 3);
            const themedAttr = this.config.themed ? '' : ' :themed="false"';
            const tag = `<Chart type="${this.config.type}" :data="chartData" :options="chartOptions"${themedAttr} />`;

            return {
                basic: tag,
                options: `<template>
    <div class="card">
        ${tag}
    </div>
</template>

<script>
export default {
    data() {
        return {
            chartData: {${labelsLine}
                datasets: [
${datasets}
                ]
            },
            chartOptions: ${optionsLiteral}
        };
    }
};
<\/script>`,
                composition: `<template>
    <div class="card">
        ${tag}
    </div>
</template>

<script setup>
import { ref } from 'vue';

const chartData = ref({${labelsLine.replace(/\n {16}/g, '\n    ')}
    datasets: [
${datasets.replace(/^ {12}/gm, '        ')}
    ]
});

const chartOptions = ref(${optionsLiteral});
<\/script>`
            };
        }
    },
    methods: {
        swatch(index) {
            return PALETTE[index % PALETTE.length];
        },
        merge(base, override) {
            if (!override) return { ...base };

            const result = { ...base };

            for (const key of Object.keys(override)) {
                const value = override[key];
                const current = result[key];
                const mergeable = value && current && typeof value === 'object' && typeof current === 'object' && !Array.isArray(value) && !Array.isArray(current);

                result[key] = mergeable ? this.merge(current, value) : value;
            }

            return result;
        },
        stringify(value, depth) {
            const pad = ' '.repeat(depth * 4);
            const inner = ' '.repeat((depth + 1) * 4);

            if (value === null || typeof value !== 'object') return typeof value === 'string' ? `'${value}'` : String(value);
            if (Array.isArray(value)) return `[${value.map((v) => this.stringify(v, depth + 1)).join(', ')}]`;

            const entries = Object.entries(value).filter(([, v]) => v !== undefined);

            if (!entries.length) return '{}';

            return `{\n${entries.map(([k, v]) => `${inner}${k}: ${this.stringify(v, depth + 1)}`).join(',\n')}\n${pad}}`;
        },
        addRow() {
            this.data.labels.push(`Item ${this.data.labels.length + 1}`);
            this.data.series.forEach((series) => {
                series.values.push(Math.round(Math.random() * 700) + 50);
                series.points.push(randomPoint());
            });
        },
        removeRow(index) {
            if (this.rowCount === 1) return;

            const at = typeof index === 'number' ? index : this.rowCount - 1;

            this.data.labels.splice(at, 1);
            this.data.series.forEach((series) => {
                series.values.splice(at, 1);
                series.points.splice(at, 1);
            });
        },
        addSeries() {
            if (this.data.series.length >= 8) return;

            this.data.series.push({
                label: `Series ${this.data.series.length + 1}`,
                values: this.data.labels.map(() => Math.round(Math.random() * 700) + 50),
                points: this.data.labels.map(() => randomPoint())
            });
        },
        removeSeries(index) {
            if (this.data.series.length === 1) return;

            this.data.series.splice(index, 1);
        },
        reset() {
            const { config, data } = defaults();

            this.config = config;
            this.data = data;
            this.advanced = '';
        }
    }
};
</script>
