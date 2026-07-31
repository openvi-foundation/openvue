<template>
    <div :class="cx('root')" :style="sx('root')" v-bind="ptmi('root')">
        <canvas ref="canvas" :width="width" :height="height" @click="onCanvasClick($event)" v-bind="{ ...canvasProps, ...ptm('canvas') }"></canvas>
    </div>
</template>

<script>
import BaseChart from './BaseChart.vue';

export default {
    name: 'Chart',
    extends: BaseChart,
    inheritAttrs: false,
    emits: ['select', 'loaded'],
    chart: null,
    isDestroyed: false,
    watch: {
        /*
         * Use deep watch to enable triggering watch for changes within structure
         * otherwise the entire data object needs to be replaced to trigger watch
         */
        data: {
            handler(newValue) {
                if (this.chart) {
                    /*
                     * Chart.js keeps a reference to the config passed on construction, so a replaced
                     * data object has to be reassigned before update() can pick the new values up.
                     */
                    this.chart.data = newValue;
                    this.chart.update();
                }
            },
            deep: true
        },
        type() {
            this.reinit();
        },
        options: {
            handler(newValue) {
                if (this.chart) {
                    this.chart.options = newValue;
                    this.chart.update();
                }
            },
            deep: true
        }
    },
    mounted() {
        this.initChart();
    },
    beforeUnmount() {
        this.isDestroyed = true;
        this.destroyChart();
    },
    methods: {
        initChart() {
            import('chart.js/auto')
                .then((module) => {
                    this.destroyChart();

                    /*
                     * The import is async, so the component may already be unmounted by the time it resolves.
                     * Creating the chart here would leave an instance attached to a detached canvas.
                     */
                    if (this.isDestroyed) {
                        return;
                    }

                    if (module && module.default) {
                        this.chart = new module.default(this.$refs.canvas, {
                            type: this.type,
                            data: this.data,
                            options: this.options,
                            plugins: this.plugins
                        });
                    }

                    this.$emit('loaded', this.chart);
                })
                .catch((error) => {
                    console.error('[OpenVue] Chart requires chart.js to be installed. Run "npm install chart.js" to use this component.', error);
                });
        },
        destroyChart() {
            if (this.chart) {
                this.chart.destroy();
                this.chart = null;
            }
        },
        getCanvas() {
            return this.$refs.canvas;
        },
        getChart() {
            return this.chart;
        },
        getBase64Image() {
            return this.chart.toBase64Image();
        },
        refresh() {
            if (this.chart) {
                this.chart.update();
            }
        },
        reinit() {
            this.initChart();
        },
        onCanvasClick(event) {
            if (this.chart) {
                const element = this.chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
                const dataset = this.chart.getElementsAtEventForMode(event, 'dataset', { intersect: true }, false);

                if (element && element[0] && dataset) {
                    this.$emit('select', { originalEvent: event, element: element[0], dataset: dataset });
                }
            }
        }
    }
};
</script>
