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

        <div class="mb-3 flex items-center justify-between gap-3">
            <span class="text-xs font-semibold uppercase tracking-wider text-muted-color">Preview</span>
            <Button label="Reset to defaults" severity="secondary" outlined size="small" @click="reset" />
        </div>

        <div class="card playground-surface">
            <div class="flex flex-col lg:flex-row">
                <!-- the chart sits at the foot of the pane so it stays anchored as the rail grows and shrinks with the type -->
                <div class="flex min-w-0 flex-1 flex-col items-center justify-end p-4">
                    <Chart :type="config.type" :data="chartData" :options="chartOptions" :themed="config.themed" :class="chartClass" style="min-height: 22rem" />
                </div>

                <ControlPanel :config="config" />
            </div>
        </div>

        <h2 class="doc-section-label">Data</h2>
        <div class="doc-section-description">
            <p v-if="pointType">
                Scatter and bubble charts plot coordinates rather than categories, so each point carries an <i>x</i> and <i>y</i><span v-if="config.type === 'bubble'"> and a radius <i>r</i></span
                >. Each series becomes one dataset and keeps its color by position.
            </p>
            <p v-else>
                Labels become the categories along the axis, and each series becomes one dataset. Series colors are assigned by position from a fixed palette, so a series keeps its color when others are added or removed. The palette holds eight
                colors; beyond that it repeats.
            </p>
        </div>

        <div class="card">
            <DataEditor :type="config.type" :data="data" :palette="palette" @add-row="addRow" @remove-row="removeRow" @add-series="addSeries" @remove-series="removeSeries" />
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
import { mergeOptions } from 'openvue/chart/utils/ChartTheme';
import ControlPanel from './playground/ControlPanel.vue';
import DataEditor from './playground/DataEditor.vue';
import { buildCode } from './playground/codegen';
import { CIRCULAR_CLASS, MAX_SERIES, buildData, buildOptions, createDefaults, isCircular, isPointType, parseAdvanced, randomPoint, randomValue } from './playground/options';
import { observeTheme, resolvePalette } from './playground/theme';

export default {
    components: {
        ControlPanel,
        DataEditor
    },
    data() {
        const { config, data } = createDefaults();

        return {
            config,
            data,
            advanced: '',
            palette: []
        };
    },
    unbindTheme: null,
    computed: {
        pointType() {
            return isPointType(this.config.type);
        },
        chartClass() {
            return isCircular(this.config.type) ? CIRCULAR_CLASS : 'w-full';
        },
        rowCount() {
            return this.pointType ? this.data.series[0].points.length : this.data.labels.length;
        },
        chartData() {
            return buildData(this.config, this.data);
        },
        advancedOptions() {
            return parseAdvanced(this.advanced);
        },
        advancedError() {
            return this.advancedOptions.error;
        },
        chartOptions() {
            return mergeOptions(buildOptions(this.config), this.advancedOptions.value);
        },
        code() {
            return buildCode({
                type: this.config.type,
                themed: this.config.themed,
                data: this.chartData,
                options: this.chartOptions,
                className: isCircular(this.config.type) ? CIRCULAR_CLASS : null
            });
        }
    },
    mounted() {
        this.syncPalette();
        this.unbindTheme = observeTheme(this.syncPalette);
    },
    beforeUnmount() {
        this.unbindTheme?.();
    },
    methods: {
        syncPalette() {
            this.palette = resolvePalette(this.$el, this.config.type, this.data.series.length);
        },
        addRow() {
            this.data.labels.push(`Item ${this.data.labels.length + 1}`);
            this.data.series.forEach((series) => {
                series.values.push(randomValue());
                series.points.push(randomPoint());
            });
        },
        removeRow(index) {
            if (this.rowCount === 1) return;

            this.data.labels.splice(index, 1);
            this.data.series.forEach((series) => {
                series.values.splice(index, 1);
                series.points.splice(index, 1);
            });
        },
        addSeries() {
            if (this.data.series.length >= MAX_SERIES) return;

            this.data.series.push({
                label: `Series ${this.data.series.length + 1}`,
                values: this.data.labels.map(() => randomValue()),
                points: this.data.labels.map(() => randomPoint())
            });
        },
        removeSeries(index) {
            if (this.data.series.length === 1) return;

            this.data.series.splice(index, 1);
        },
        reset() {
            const { config, data } = createDefaults();

            this.config = config;
            this.data = data;
            this.advanced = '';
        }
    }
};
</script>

<style scoped>
/* the options rail runs to the edge of the surface, so the padding belongs to the panes instead */
.playground-surface {
    padding: 0;
    overflow: hidden;
}
</style>
