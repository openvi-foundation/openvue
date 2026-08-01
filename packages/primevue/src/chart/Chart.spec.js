import { flushPromises, mount } from '@vue/test-utils';
import { vi } from 'vitest';
import ChartJS from 'chart.js/auto';
import Chart from './Chart.vue';
import { applyPalette, mergeOptions } from './utils/ChartTheme';

vi.mock('chart.js/auto', () => {
    const instances = [];

    class ChartJSMock {
        constructor(canvas, config) {
            this.canvas = canvas;
            this.data = config.data;
            this.options = config.options;
            this.update = vi.fn();
            this.destroy = vi.fn();
            this.toBase64Image = vi.fn(() => 'data:image/png;base64,stub');
            instances.push(this);
        }
    }

    ChartJSMock.instances = instances;

    return { default: ChartJSMock };
});

const instances = ChartJS.instances;

const data = {
    labels: ['Q1', 'Q2'],
    datasets: [{ label: 'Sales', data: [1, 2] }]
};

const mountChart = async (props = {}) => {
    const wrapper = mount(Chart, { props: { type: 'bar', data, ...props } });

    await flushPromises();

    return wrapper;
};

describe('Chart.vue', () => {
    beforeEach(() => {
        instances.length = 0;
    });

    it('is canvas element exist', async () => {
        const wrapper = await mountChart();

        expect(wrapper.find('canvas').exists()).toBe(true);
        expect(instances.length).toBe(1);
    });

    it('is getCanvas returning the rendered canvas element', async () => {
        const wrapper = await mountChart();

        expect(wrapper.vm.getCanvas()).toBe(wrapper.find('canvas').element);
    });

    it('is getChart returning the chart instance', async () => {
        const wrapper = await mountChart();

        expect(wrapper.vm.getChart()).toBe(instances[0]);
    });

    it('is loaded event emitted with the chart instance', async () => {
        const wrapper = await mountChart();

        expect(wrapper.emitted().loaded[0][0]).toBe(instances[0]);
    });

    it('is data change updating the chart instead of recreating it', async () => {
        const wrapper = await mountChart();
        const chart = instances[0];

        await wrapper.setProps({ data: { labels: ['Q1'], datasets: [{ label: 'Sales', data: [9] }] } });

        expect(chart.update).toHaveBeenCalled();
        expect(chart.destroy).not.toHaveBeenCalled();
        expect(instances.length).toBe(1);
    });

    it('is replaced data reassigned before updating', async () => {
        const wrapper = await mountChart();
        const chart = instances[0];
        const next = { labels: ['Q1'], datasets: [{ label: 'Sales', data: [9] }] };

        await wrapper.setProps({ data: next });

        expect(chart.data).toEqual(next);
    });

    it('is options change updating the chart instead of recreating it', async () => {
        const wrapper = await mountChart({ options: { responsive: true } });
        const chart = instances[0];

        await wrapper.setProps({ options: { responsive: false } });

        expect(chart.options).toEqual({ responsive: false });
        expect(chart.update).toHaveBeenCalled();
        expect(instances.length).toBe(1);
    });

    it('is type change recreating the chart', async () => {
        const wrapper = await mountChart();
        const first = instances[0];

        await wrapper.setProps({ type: 'line' });
        await flushPromises();

        expect(first.destroy).toHaveBeenCalled();
        expect(instances.length).toBe(2);
    });

    it('is chart destroyed on unmount', async () => {
        const wrapper = await mountChart();
        const chart = instances[0];

        wrapper.unmount();

        expect(chart.destroy).toHaveBeenCalled();
    });

    it('is no chart created when unmounted before the import resolves', async () => {
        const wrapper = mount(Chart, { props: { type: 'bar', data } });

        wrapper.unmount();
        await flushPromises();

        expect(instances.length).toBe(0);
    });

    it('is theme applied from design tokens when they resolve', async () => {
        const wrapper = await mountChart();

        /*
         * jsdom does not inherit custom properties to descendants the way browsers do,
         * so the tokens are set on the element the component reads from.
         */
        const el = wrapper.element;

        el.style.setProperty('--p-text-color', '#111827');
        el.style.setProperty('--p-text-muted-color', '#6b7280');
        el.style.setProperty('--p-content-border-color', '#e5e7eb');
        el.style.setProperty('--p-content-background', '#ffffff');
        el.style.setProperty('--p-blue-500', '#3b82f6');

        wrapper.vm.syncChart();

        const chart = wrapper.vm.getChart();

        expect(chart.options.scales.x.ticks.color).toBe('#6b7280');
        expect(chart.options.plugins.legend.labels.color).toBe('#111827');
        expect(chart.data.datasets[0].backgroundColor).toBe('#3b82f6');
    });

    it('is dark scheme selected from the resolved surface', async () => {
        const wrapper = await mountChart();
        const el = wrapper.element;

        el.style.setProperty('--p-text-color', '#f8fafc');
        el.style.setProperty('--p-content-background', '#0f172a');
        el.style.setProperty('--p-blue-500', '#3b82f6');
        el.style.setProperty('--p-amber-600', '#d97706');

        wrapper.vm.syncChart();

        // second slot resolves the dark step (amber.600) rather than the light one
        expect(wrapper.vm.getChart().options.plugins.legend.labels.color).toBe('#f8fafc');
    });

    it('is user options taking precedence over token defaults', async () => {
        const wrapper = await mountChart({ options: { scales: { x: { ticks: { color: 'rebeccapurple' } } } } });

        expect(wrapper.vm.getChart().options.scales.x.ticks.color).toBe('rebeccapurple');
    });

    it('is themed disabled passing options through untouched', async () => {
        const options = { scales: { x: { ticks: { color: 'red' } } } };
        const wrapper = await mountChart({ themed: false, options });

        expect(wrapper.vm.getChart().options).toEqual(options);
    });

    it('is select event emitted on canvas click', async () => {
        const wrapper = await mountChart();
        const element = { index: 0 };

        instances[0].getElementsAtEventForMode = vi.fn(() => [element]);

        await wrapper.find('canvas').trigger('click');

        expect(wrapper.emitted().select[0][0].element).toBe(element);
    });
});

describe('ChartTheme.mergeOptions', () => {
    it('is user value winning at any depth', () => {
        const merged = mergeOptions({ scales: { x: { ticks: { color: 'token' } } } }, { scales: { x: { ticks: { color: 'user' } } } });

        expect(merged.scales.x.ticks.color).toBe('user');
    });

    it('is token defaults kept where the user set nothing', () => {
        const merged = mergeOptions({ scales: { x: { ticks: { color: 'token' }, grid: { color: 'grid' } } } }, { scales: { x: { ticks: { color: 'user' } } } });

        expect(merged.scales.x.grid.color).toBe('grid');
    });

    it('is arrays replaced rather than merged', () => {
        expect(mergeOptions({ list: [1, 2, 3] }, { list: [9] }).list).toEqual([9]);
    });
});

describe('ChartTheme.applyPalette', () => {
    const palette = ['#111', '#222', '#333'];

    it('is slots assigned by dataset index', () => {
        const result = applyPalette({ datasets: [{ data: [1] }, { data: [2] }] }, 'line', palette);

        expect(result.datasets[0].borderColor).toBe('#111');
        expect(result.datasets[1].borderColor).toBe('#222');
    });

    it('is user supplied colors left alone', () => {
        const result = applyPalette({ datasets: [{ data: [1], borderColor: 'hotpink' }] }, 'line', palette);

        expect(result.datasets[0].borderColor).toBe('hotpink');
    });

    it('is radial types colored per data point', () => {
        const result = applyPalette({ datasets: [{ data: [1, 2, 3] }] }, 'pie', palette);

        expect(result.datasets[0].backgroundColor).toEqual(palette);
    });

    it('is source data not mutated', () => {
        const source = { datasets: [{ data: [1] }] };

        applyPalette(source, 'bar', palette);

        expect(source.datasets[0].borderColor).toBeUndefined();
    });
});
