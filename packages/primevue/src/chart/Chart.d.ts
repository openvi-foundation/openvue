/**
 *
 * Chart is a wrapper around Chart.js, rendering data driven charts on a canvas element.
 *
 * [Live Demo](https://openvue.dev/chart/)
 *
 * @module chart
 *
 */
import type { ChartData, ChartOptions, ChartType, Plugin } from 'chart.js';
import type { DefineComponent, DesignToken, EmitFn, PassThrough } from '@openvue/core';
import type { ComponentHooks } from '@openvue/core/basecomponent';
import type { PassThroughOptions } from 'openvue/passthrough';
import { CanvasHTMLAttributes } from 'vue';

export declare type ChartPassThroughOptionType = ChartPassThroughAttributes | ((options: ChartPassThroughMethodOptions) => ChartPassThroughAttributes | string) | string | null | undefined;

/**
 * Custom passthrough(pt) option method.
 */
export interface ChartPassThroughMethodOptions {
    /**
     * Defines instance.
     */
    instance: any;
    /**
     * Defines valid properties.
     */
    props: ChartProps;
    /**
     * Defines valid attributes.
     */
    attrs: any;
    /**
     * Defines parent options.
     */
    parent: any;
    /**
     * Defines passthrough(pt) options in global config.
     */
    global: object | undefined;
}

/**
 * Custom passthrough(pt) options.
 * @see {@link ChartProps.pt}
 */
export interface ChartPassThroughOptions {
    /**
     * Used to pass attributes to the root's DOM element.
     */
    root?: ChartPassThroughOptionType;
    /**
     * Used to pass attributes to the canvas's DOM element.
     */
    canvas?: ChartPassThroughOptionType;
    /**
     * Used to manage all lifecycle hooks.
     * @see {@link BaseComponent.ComponentHooks}
     */
    hooks?: ComponentHooks;
}

/**
 * Custom passthrough attributes for each DOM elements
 */
export interface ChartPassThroughAttributes {
    [key: string]: any;
}

/**
 * Custom select event.
 * @see {@link ChartEmitsOptions.select}
 */
export interface ChartSelectEvent {
    /**
     * Browser event.
     */
    originalEvent: Event;
    /**
     * Selected element.
     */
    element: HTMLElement | any;
    /**
     * Selected dataset.
     */
    dataset: any;
}

/**
 * Defines valid properties in Chart component.
 */
export interface ChartProps<TType extends ChartType = ChartType> {
    /**
     * Type of the chart.
     */
    type?: TType | undefined;
    /**
     * Data to display.
     */
    data?: ChartData<TType> | undefined;
    /**
     * Options to customize the chart.
     */
    options?: ChartOptions<TType> | undefined;
    /**
     * Used to custom plugins of the chart.
     */
    plugins?: Plugin<TType>[];
    /**
     * Width of the chart in non-responsive mode.
     * @defaultValue 300
     */
    width?: number | undefined;
    /**
     * Height of the chart in non-responsive mode.
     * @defaultValue 150
     */
    height?: number | undefined;
    /**
     * Used to pass all properties of the CanvasHTMLAttributes to canvas element inside the component.
     */
    canvasProps?: CanvasHTMLAttributes | undefined;
    /**
     * It generates scoped CSS variables using design tokens for the component.
     */
    dt?: DesignToken<any>;
    /**
     * Used to pass attributes to DOM elements inside the component.
     * @type {ChartPassThroughOptions}
     */
    pt?: PassThrough<ChartPassThroughOptions>;
    /**
     * Used to configure passthrough(pt) options of the component.
     * @type {PassThroughOptions}
     */
    ptOptions?: PassThroughOptions;
    /**
     * When enabled, it removes component related styles in the core.
     * @defaultValue false
     */
    unstyled?: boolean;
}

export interface ChartSlots {}

/**
 * Defines valid emits in Chart component.
 */
export interface ChartEmitsOptions {
    /**
     * Callback to invoke when a data element of the chart is clicked.
     * @param {ChartSelectEvent} event - Custom select event.
     */
    select(event: ChartSelectEvent): void;
    /**
     * Callback to invoke when chart is loaded.
     * @param {*} chart - Chart instance.
     */
    loaded(chart: any): void;
}

export declare type ChartEmits = EmitFn<ChartEmitsOptions>;

export interface ChartMethods {
    /**
     * Redraws the graph.
     *
     * @memberof Chart
     */
    refresh(): void;
    /**
     * Destroys the graph first and then creates it again.
     *
     * @memberof Chart
     */
    reinit(): void;
    /**
     * Returns the canvas element the chart is rendered on.
     *
     * @memberof Chart
     */
    getCanvas(): HTMLCanvasElement | undefined;
    /**
     * Returns a base64 encoded png image of the chart.
     *
     * @memberof Chart
     */
    getBase64Image(): string;
    /**
     * Returns Chart instance.
     *
     * @memberof Chart
     */
    getChart(): any;
}

/**
 * **OpenVue - Chart**
 *
 * _Chart is a wrapper around Chart.js, rendering data driven charts on a canvas element._
 *
 * [Live Demo](https://openvue.dev/chart/)
 * --- ---
 * ![OpenVue](https://primefaces.org/cdn/primevue/images/logo-100.png)
 *
 * @group Component
 *
 */
declare const Chart: DefineComponent<ChartProps, ChartSlots, ChartEmits, ChartMethods>;

declare module 'vue' {
    export interface GlobalComponents {
        Chart: DefineComponent<ChartProps, ChartSlots, ChartEmits, ChartMethods>;
    }
}

export default Chart;
