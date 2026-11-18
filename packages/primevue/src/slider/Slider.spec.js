import { mount } from '@vue/test-utils';
import Slider from './Slider.vue';

describe('Slider.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(Slider, {
            props: {
                modelValue: null
            }
        });
    });

    it('should exist', () => {
        expect(wrapper.find('.p-slider.p-component').exists()).toBe(true);
        expect(wrapper.find('.p-slider').classes()).toContain('p-slider-horizontal');
    });

    it('should drag start and end', async () => {
        await wrapper.vm.onDragStart({ preventDefault: () => {}, currentTarget: { focus: () => {} } });

        expect(wrapper.find('.p-slider').classes()).toStrictEqual(['p-slider', 'p-component', 'p-slider-horizontal']);

        await wrapper.vm.onDragEnd();

        expect(wrapper.find('.p-slider').classes()).not.toContain('p-slider-sliding');
    });

    it('should set value', async () => {
        wrapper.element.setAttribute('width', '14rem');

        await wrapper.vm.updateDomData();

        await wrapper.vm.setValue({ pageX: 60 }); // TODO:

        expect(wrapper.emitted()['update:modelValue'][0][0]).toBeGreaterThan(0);
    });

    it('should set value on vertical mode', async () => {
        await wrapper.setProps({ orientation: 'vertical', modelValue: 50 });

        await wrapper.vm.updateDomData();

        await wrapper.vm.setValue({ pageY: 111 }); // TODO:

        expect(wrapper.emitted()['update:modelValue'][0][0]).toBe(0);
    });

    it('should handle values outside range by filling the slider', async () => {
        await wrapper.setProps({ min: 0, max: 200, modelValue: [-50, 250], range: true });

        expect(wrapper.vm.rangeStartPosition).toBe(0);

        expect(wrapper.vm.rangeEndPosition).toBe(100);

        await wrapper.setProps({ min: -200, max: 200, modelValue: [-250, 250], range: true });

        expect(wrapper.vm.rangeStartPosition).toBe(0);

        expect(wrapper.vm.rangeEndPosition).toBe(100);
    });

    it('should handle values within range', async () => {
        await wrapper.setProps({ min: -100, max: 100, modelValue: [0, 50], range: true });

        expect(wrapper.vm.rangeStartPosition).toBe(50);

        expect(wrapper.vm.rangeEndPosition).toBe(75);
    });

    it('should handle exact min and max values', async () => {
        await wrapper.setProps({ min: -100, max: 100, modelValue: [-100, 100], range: true });

        expect(wrapper.vm.rangeStartPosition).toBe(0);

        expect(wrapper.vm.rangeEndPosition).toBe(100);
    });

    it('should handle fully positive range', async () => {
        await wrapper.setProps({ min: -100, max: 100, modelValue: [0, 100], range: true });

        expect(wrapper.vm.rangeStartPosition).toBe(50);

        expect(wrapper.vm.rangeEndPosition).toBe(100);
    });

    it('should handle fully negative range', async () => {
        await wrapper.setProps({ min: -200, max: -100, modelValue: [-200, -150], range: true });

        expect(wrapper.vm.rangeStartPosition).toBe(0);

        expect(wrapper.vm.rangeEndPosition).toBe(50);
    });

    it('should treat 0 as a valid start value', async () => {
        await wrapper.setProps({ min: -100, max: 100, modelValue: [0, 50], range: true });

        expect(wrapper.vm.rangeStartPosition).toBe(50);

        expect(wrapper.vm.rangeEndPosition).toBe(75);
    });
});

describe('Slider.vue value selection', () => {
    const mountSlider = (props) => {
        const wrapper = mount(Slider, {
            props: {
                ...props,
                'onUpdate:modelValue': (value) => wrapper.setProps({ modelValue: value })
            }
        });

        wrapper.element.getBoundingClientRect = () => ({ left: 0, top: 0 });
        Object.defineProperty(wrapper.element, 'offsetWidth', { value: 100 });
        Object.defineProperty(wrapper.element, 'offsetHeight', { value: 100 });

        return wrapper;
    };

    const clickAt = (wrapper, percent) => wrapper.trigger('click', { pageX: percent });

    const press = (wrapper, code, handleIndex = 0) => wrapper.findAll('[role="slider"]')[handleIndex].trigger('keydown', { code });

    const emittedValues = (wrapper) => (wrapper.emitted('update:modelValue') ?? []).map(([value]) => value);

    describe('with step', () => {
        it('should select min when clicking near the start', async () => {
            const wrapper = mountSlider({ modelValue: 60, step: 20 });

            await clickAt(wrapper, 3);

            expect(wrapper.props('modelValue')).toBe(0);
        });

        it('should select max when clicking near the end', async () => {
            const wrapper = mountSlider({ modelValue: 40, step: 20 });

            await clickAt(wrapper, 97);

            expect(wrapper.props('modelValue')).toBe(100);
        });

        it('should snap to the nearest step on either side of the click', async () => {
            const wrapper = mountSlider({ modelValue: 60, step: 20 });

            await clickAt(wrapper, 21);
            expect(wrapper.props('modelValue')).toBe(20);

            await clickAt(wrapper, 39);
            expect(wrapper.props('modelValue')).toBe(40);
        });

        it('should keep the steps aligned to min when the value is between steps', async () => {
            const wrapper = mountSlider({ modelValue: 30, step: 20 });

            await clickAt(wrapper, 3);
            expect(wrapper.props('modelValue')).toBe(0);

            await clickAt(wrapper, 58);
            expect(wrapper.props('modelValue')).toBe(60);
        });

        it('should keep the steps aligned to a non-zero min', async () => {
            const wrapper = mountSlider({ modelValue: 5, min: 5, max: 45, step: 10 });

            await clickAt(wrapper, 70);

            expect(wrapper.props('modelValue')).toBe(35);
        });

        it('should stop at the last step when the range is not a multiple of the step', async () => {
            const wrapper = mountSlider({ modelValue: 0, max: 10, step: 3 });

            await clickAt(wrapper, 100);
            expect(wrapper.props('modelValue')).toBe(9);

            await press(wrapper, 'Home');
            await press(wrapper, 'End');
            expect(wrapper.props('modelValue')).toBe(9);
        });

        it('should select max when it is closer than the last step', async () => {
            const wrapper = mountSlider({ modelValue: 0, max: 11, step: 3 });

            await clickAt(wrapper, 100);

            expect(wrapper.props('modelValue')).toBe(11);
        });

        it('should not go past a max with more decimals than the step', async () => {
            const wrapper = mountSlider({ modelValue: 0, max: 10.5, step: 1 });

            await clickAt(wrapper, 100);
            expect(wrapper.props('modelValue')).toBe(10.5);

            await press(wrapper, 'Home');
            await press(wrapper, 'End');
            expect(wrapper.props('modelValue')).toBe(10.5);
        });

        it('should keep the steps aligned after End', async () => {
            const wrapper = mountSlider({ modelValue: 0, max: 11, step: 3 });

            await press(wrapper, 'End');
            await clickAt(wrapper, 2);

            expect(wrapper.props('modelValue')).toBe(0);
        });

        it('should emit exact values for a decimal step', async () => {
            const wrapper = mountSlider({ modelValue: 0, max: 1, step: 0.1 });

            await clickAt(wrapper, 31);
            expect(wrapper.props('modelValue')).toBe(0.3);

            await press(wrapper, 'ArrowRight');
            expect(wrapper.props('modelValue')).toBe(0.4);
        });

        it('should support steps with more than two decimals', async () => {
            const wrapper = mountSlider({ modelValue: 0, max: 1, step: 0.005 });

            await clickAt(wrapper, 12.3);

            expect(wrapper.props('modelValue')).toBe(0.125);
        });

        it('should snap to the nearest step in vertical mode', async () => {
            const wrapper = mountSlider({ modelValue: 0, step: 25, orientation: 'vertical' });

            await wrapper.trigger('click', { pageY: 20 });

            expect(wrapper.props('modelValue')).toBe(75);
        });

        it('should not change a value between steps until the user interacts', () => {
            const wrapper = mountSlider({ modelValue: 30, step: 20 });

            expect(wrapper.emitted('update:modelValue')).toBeUndefined();
            expect(wrapper.find('[role="slider"]').attributes('aria-valuenow')).toBe('30');
        });
    });

    describe('without step', () => {
        it('should round to the nearest whole number', async () => {
            const wrapper = mountSlider({ modelValue: 1, min: 1, max: 3 });

            await clickAt(wrapper, 98);
            expect(wrapper.props('modelValue')).toBe(3);

            await clickAt(wrapper, 30);
            expect(wrapper.props('modelValue')).toBe(2);
        });

        it('should follow the pointer while dragging', async () => {
            const wrapper = mountSlider({ modelValue: 1, min: 1, max: 3 });

            await wrapper.find('[role="slider"]').trigger('mousedown');
            document.dispatchEvent(Object.assign(new MouseEvent('mousemove'), { pageX: 100 }));
            document.dispatchEvent(Object.assign(new MouseEvent('mousemove'), { pageX: 95 }));
            document.dispatchEvent(new MouseEvent('mouseup'));

            expect(emittedValues(wrapper)).toEqual([3]);
        });
    });

    describe('emitting', () => {
        it('should not emit when clicking on the current value', async () => {
            const wrapper = mountSlider({ modelValue: 40, step: 20 });

            await clickAt(wrapper, 45);

            expect(wrapper.emitted('update:modelValue')).toBeUndefined();
            expect(wrapper.emitted('change')).toBeUndefined();
        });

        it('should emit only when the value changes while dragging', async () => {
            const wrapper = mountSlider({ modelValue: 0, step: 20 });

            await wrapper.find('[role="slider"]').trigger('mousedown');

            for (const pageX of [5, 15, 25, 35, 45]) {
                document.dispatchEvent(Object.assign(new MouseEvent('mousemove'), { pageX }));
            }

            document.dispatchEvent(new MouseEvent('mouseup'));

            expect(emittedValues(wrapper)).toEqual([20, 40]);
            expect(wrapper.emitted('slideend')).toHaveLength(1);
        });

        it('should not emit when pressing Home at min', async () => {
            const wrapper = mountSlider({ modelValue: 0 });

            await press(wrapper, 'Home');

            expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        });

        it('should emit min when the model is empty', async () => {
            const wrapper = mountSlider({ modelValue: null, step: 20 });

            await clickAt(wrapper, 3);

            expect(emittedValues(wrapper)).toEqual([0]);
        });

        it('should not emit when the moved range handle keeps its value', async () => {
            const wrapper = mountSlider({ modelValue: [20, 80], step: 20, range: true });

            await press(wrapper, 'End', 1);
            await press(wrapper, 'Home', 0);

            expect(wrapper.emitted('update:modelValue')).toEqual([[[20, 100]], [[0, 100]]]);

            await press(wrapper, 'End', 1);
            await press(wrapper, 'Home', 0);

            expect(wrapper.emitted('update:modelValue')).toHaveLength(2);
        });
    });

    describe('keyboard', () => {
        it('should move by one step with the arrow keys', async () => {
            const wrapper = mountSlider({ modelValue: 40, step: 20 });

            await press(wrapper, 'ArrowRight');
            expect(wrapper.props('modelValue')).toBe(60);

            await press(wrapper, 'ArrowDown');
            await press(wrapper, 'ArrowLeft');
            expect(wrapper.props('modelValue')).toBe(20);
        });

        it('should move to the next step when the value is between steps', async () => {
            const wrapper = mountSlider({ modelValue: 30, step: 20 });

            await press(wrapper, 'ArrowRight');
            expect(wrapper.props('modelValue')).toBe(40);

            await wrapper.setProps({ modelValue: 30 });
            await press(wrapper, 'ArrowLeft');
            expect(wrapper.props('modelValue')).toBe(20);
        });

        it('should not emit when the value is already at the bound', async () => {
            const wrapper = mountSlider({ modelValue: 100, step: 20 });

            await press(wrapper, 'ArrowRight');
            await press(wrapper, 'PageUp');

            expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        });

        it('should move by ten steps with PageUp and PageDown', async () => {
            const wrapper = mountSlider({ modelValue: 0, max: 200, step: 5 });

            await press(wrapper, 'PageUp');
            expect(wrapper.props('modelValue')).toBe(50);

            await press(wrapper, 'PageDown');
            expect(wrapper.props('modelValue')).toBe(0);
        });

        it('should clamp PageUp to the last step', async () => {
            const wrapper = mountSlider({ modelValue: 40, step: 20 });

            await press(wrapper, 'PageUp');

            expect(wrapper.props('modelValue')).toBe(100);
        });

        it('should select min and max with Home and End', async () => {
            const wrapper = mountSlider({ modelValue: 50 });

            await press(wrapper, 'End');
            expect(wrapper.props('modelValue')).toBe(100);

            await press(wrapper, 'Home');
            expect(wrapper.props('modelValue')).toBe(0);
        });
    });

    describe('range', () => {
        it('should snap the moved handle to the nearest step', async () => {
            const wrapper = mountSlider({ modelValue: [20, 80], step: 20, range: true });

            await press(wrapper, 'ArrowRight', 0);
            expect(wrapper.props('modelValue')).toEqual([40, 80]);

            await press(wrapper, 'ArrowLeft', 1);
            expect(wrapper.props('modelValue')).toEqual([40, 60]);
        });

        it('should move by ten steps with PageUp without a step', async () => {
            const wrapper = mountSlider({ modelValue: [0, 50], range: true });

            await press(wrapper, 'PageUp', 0);
            expect(wrapper.props('modelValue')).toEqual([10, 50]);

            await press(wrapper, 'PageDown', 1);
            expect(wrapper.props('modelValue')).toEqual([10, 40]);
        });
    });
});
