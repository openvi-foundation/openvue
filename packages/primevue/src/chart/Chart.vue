<template>
    <div :class="cx('root')" :style="sx('root')" v-bind="ptmi('root')">
        <canvas ref="canvas" :width="width" :height="height" @click="onCanvasClick($event)" v-bind="{ ...canvasProps, ...ptm('canvas') }"></canvas>
    </div>
</template>

<script>
import { ThemeService } from '@openuxkit/styled';
import BaseChart from './BaseChart.vue';
import { applyPalette, getChartTheme, mergeOptions } from './utils/ChartTheme';

export default {
    name: 'Chart',
    extends: BaseChart,
    inheritAttrs: false,
    emits: ['select', 'loaded'],
    chart: null,
    isDestroyed: false,
    themeChangeListener: null,
    themeObserver: null,
    watch: {
        /*
         * Use deep watch to enable triggering watch for changes within structure
         * otherwise the entire data object needs to be replaced to trigger watch
         */
        data: {
            handler() {
                this.syncChart();
            },
            deep: true
        },
        type() {
            this.reinit();
        },
        options: {
            handler() {
                this.syncChart();
            },
            deep: true
        },
        themed() {
            this.unbindThemeListeners();
            this.bindThemeListeners();
            this.syncChart();
        }
    },
    mounted() {
        this.initChart();
        this.bindThemeListeners();
    },
    beforeUnmount() {
        this.isDestroyed = true;
        this.unbindThemeListeners();
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
                        const { data, options } = this.resolveConfig();

                        this.chart = new module.default(this.$refs.canvas, {
                            type: this.type,
                            data,
                            options,
                            plugins: this.plugins
                        });
                    }

                    this.$emit('loaded', this.chart);
                })
                .catch((error) => {
                    console.error('[OpenVue] Chart requires chart.js to be installed. Run "npm install chart.js" to use this component.', error);
                });
        },
        resolveConfig() {
            const theme = this.themed ? getChartTheme(this.$el, this.type, this.data?.datasets?.length ?? 0) : null;

            return {
                data: theme ? applyPalette(this.data, this.type, theme.palette) : this.data,
                options: theme ? mergeOptions(theme.options, this.options) : this.options
            };
        },
        syncChart() {
            if (!this.chart) {
                return;
            }

            const { data, options } = this.resolveConfig();

            /*
             * Chart.js keeps a reference to the config passed on construction, so replaced data and
             * options objects have to be reassigned before update() can pick the new values up.
             */
            this.chart.data = data;
            this.chart.options = options;
            this.chart.update();
        },
        bindThemeListeners() {
            if (!this.themed || typeof window === 'undefined') {
                return;
            }

            this.themeChangeListener = () => this.syncChart();
            ThemeService.on('theme:change', this.themeChangeListener);

            /*
             * A preset swap emits through ThemeService, but toggling dark mode only rewrites CSS
             * custom properties, which fires nothing. Watching the attributes that scope those
             * properties covers the toggle however the application implements it.
             */
            if (typeof MutationObserver !== 'undefined') {
                this.themeObserver = new MutationObserver(this.themeChangeListener);
                this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
            }
        },
        unbindThemeListeners() {
            if (this.themeChangeListener) {
                ThemeService.off('theme:change', this.themeChangeListener);
                this.themeChangeListener = null;
            }

            if (this.themeObserver) {
                this.themeObserver.disconnect();
                this.themeObserver = null;
            }
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
