import { flushPromises, mount } from '@vue/test-utils';
import { vi } from 'vitest';
import ChartJS from 'chart.js/auto';
import Chart from './Chart.vue';

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

    it('is select event emitted on canvas click', async () => {
        const wrapper = await mountChart();
        const element = { index: 0 };

        instances[0].getElementsAtEventForMode = vi.fn(() => [element]);

        await wrapper.find('canvas').trigger('click');

        expect(wrapper.emitted().select[0][0].element).toBe(element);
    });
});
