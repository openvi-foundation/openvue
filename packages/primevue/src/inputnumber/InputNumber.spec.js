import { mount } from '@vue/test-utils';
import InputNumber from './InputNumber.vue';

describe('InputNumber.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(InputNumber, {
            props: {
                modelValue: 1
            }
        });
    });

    it('is exist', () => {
        expect(wrapper.find('.p-inputnumber.p-component').exists()).toBe(true);
        expect(wrapper.find('input.p-inputnumber-input').exists()).toBe(true);
    });

    it('is keydown called when down and up keys pressed', async () => {
        await wrapper.vm.onInputKeyDown({ code: 'ArrowUp', target: { value: 1 }, preventDefault: () => {} });

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([2]);

        await wrapper.vm.onInputKeyDown({ code: 'ArrowDown', target: { value: 2 }, preventDefault: () => {} });

        expect(wrapper.emitted()['update:modelValue'][1]).toEqual([1]);
    });

    it('is keydown called when tab key pressed', async () => {
        await wrapper.vm.onInputKeyDown({ code: 'Tab', target: { value: '12' }, preventDefault: () => {} });

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([12]);
        expect(wrapper.find('input.p-inputnumber-input').attributes()['aria-valuenow']).toBe('12');
    });

    it('is keydown called when enter key pressed', async () => {
        await wrapper.vm.onInputKeyDown({ code: 'Enter', target: { value: '12' }, preventDefault: () => {} });

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([12]);
        expect(wrapper.find('input.p-inputnumber-input').attributes()['aria-valuenow']).toBe('12');
    });

    it('is keypress called when pressed a number', async () => {
        wrapper.find('input.p-inputnumber-input').element.setSelectionRange(2, 2);

        await wrapper.vm.onInputKeyPress({ key: '1', preventDefault: () => {} });

        expect(wrapper.emitted().input[0][0].value).toBe(11);
    });

    it('is keypress called when pressed minus', async () => {
        wrapper.find('input.p-inputnumber-input').element.setSelectionRange(0, 0);

        await wrapper.vm.onInputKeyPress({ key: '-', preventDefault: () => {} });

        expect(wrapper.emitted().input[0][0].value).toBe(-1);
    });

    it('should have min boundary', async () => {
        await wrapper.setProps({ modelValue: 95, min: 95 });

        await wrapper.vm.onInputKeyDown({ code: 'ArrowDown', target: { value: 96 }, preventDefault: () => {} });

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([95]);

        await wrapper.vm.onInputKeyDown({ code: 'ArrowDown', target: { value: 95 }, preventDefault: () => {} });

        expect(wrapper.emitted()['update:modelValue'][1]).toEqual([95]);
    });

    it('should have max boundary', async () => {
        await wrapper.setProps({ modelValue: 99, max: 100 });

        await wrapper.vm.onInputKeyDown({ code: 'ArrowUp', target: { value: 99 }, preventDefault: () => {} });

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([100]);

        await wrapper.vm.onInputKeyDown({ code: 'ArrowUp', target: { value: 100 }, preventDefault: () => {} });

        expect(wrapper.emitted()['update:modelValue'][1]).toEqual([100]);
    });

    it('should have currency', async () => {
        await wrapper.setProps({ modelValue: 12345, mode: 'currency', currency: 'USD', locale: 'en-US' });

        expect(wrapper.find('input.p-inputnumber-input').element._value).toBe('$12,345.00');
    });

    it('should have prefix', async () => {
        await wrapper.setProps({ modelValue: 20, prefix: '%' });

        expect(wrapper.find('input.p-inputnumber-input').element._value).toBe('%20');
    });

    it('should step 0.1 without floating point drift', async () => {
        await wrapper.setProps({ modelValue: 0, step: 0.1, minFractionDigits: 1 });

        const input = wrapper.find('input.p-inputnumber-input').element;

        for (let i = 0; i < 10; i++) {
            await wrapper.vm.onInputKeyDown({ code: 'ArrowUp', target: input, preventDefault: () => {} });
        }

        const emitted = wrapper.emitted()['update:modelValue'].map(([value]) => value);

        // as doubles this drifts to 0.30000000000000004 and ends on 0.9999999999999999
        expect(emitted).toEqual([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]);
    });

    it('should step by a step written in exponent notation', async () => {
        await wrapper.setProps({ modelValue: 0, step: 1e-7, maxFractionDigits: 7 });

        const input = wrapper.find('input.p-inputnumber-input').element;

        await wrapper.vm.onInputKeyDown({ code: 'ArrowUp', target: input, preventDefault: () => {} });
        await wrapper.vm.onInputKeyDown({ code: 'ArrowUp', target: input, preventDefault: () => {} });

        expect(wrapper.emitted()['update:modelValue']).toEqual([[1e-7], [2e-7]]);
    });

    it('should round the value to the fraction digits the field shows', async () => {
        await wrapper.setProps({ locale: 'en-US', maxFractionDigits: 2 });

        await wrapper.vm.onInputKeyDown({ code: 'Enter', target: { value: '1.005' }, preventDefault: () => {} });

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([1.01]);

        await wrapper.setProps({ roundingMode: 'floor' });

        await wrapper.vm.onInputKeyDown({ code: 'Enter', target: { value: '1.009' }, preventDefault: () => {} });

        expect(wrapper.emitted()['update:modelValue'][1]).toEqual([1]);
    });

    it('should round a bound finer than the format towards the inside', async () => {
        await wrapper.setProps({ locale: 'en-US', maxFractionDigits: 3, min: '0.0004', max: '1.2345' });

        await wrapper.vm.onInputKeyDown({ code: 'Enter', target: { value: '5' }, preventDefault: () => {} });
        await wrapper.vm.onInputKeyDown({ code: 'Enter', target: { value: '-5' }, preventDefault: () => {} });

        expect(wrapper.emitted()['update:modelValue']).toEqual([[1.234], [0.001]]);
    });

    it('should not round when the field is not formatted', async () => {
        await wrapper.setProps({ locale: 'en-US', format: false, modelValue: 0, step: 0.0001 });

        const input = wrapper.find('input.p-inputnumber-input').element;

        await wrapper.vm.onInputKeyDown({ code: 'ArrowUp', target: input, preventDefault: () => {} });
        await wrapper.vm.onInputKeyDown({ code: 'ArrowUp', target: input, preventDefault: () => {} });

        expect(wrapper.emitted()['update:modelValue']).toEqual([[0.0001], [0.0002]]);
    });

    it('should keep a bound past Number.MAX_VALUE within what the format can show', async () => {
        await wrapper.setProps({ max: '1' + '0'.repeat(400) });

        await wrapper.vm.onInputKeyDown({ code: 'Enter', target: { value: '9'.repeat(401) }, preventDefault: () => {} });

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([Number.MAX_VALUE]);
    });

    it('should keep the value within what the format can show', async () => {
        await wrapper.vm.onInputKeyDown({ code: 'Enter', target: { value: '1' + '0'.repeat(309) }, preventDefault: () => {} });

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([Number.MAX_VALUE]);
        expect(wrapper.find('input.p-inputnumber-input').element.value).not.toContain('∞');
    });

    it('should not report a change for a lone minus sign', () => {
        expect(wrapper.vm.isValueChanged('-', '-')).toBe(false);
    });

    it('should emit a number whenever it holds the value exactly', async () => {
        await wrapper.setProps({ locale: 'en-US', maxFractionDigits: 2 });

        await wrapper.vm.onInputKeyDown({ code: 'Enter', target: { value: '12' }, preventDefault: () => {} });

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([12]);

        await wrapper.vm.onInputKeyDown({ code: 'Enter', target: { value: '0.1' }, preventDefault: () => {} });

        expect(wrapper.emitted()['update:modelValue'][1]).toEqual([0.1]);
    });

    it('should preserve digits beyond Number.MAX_SAFE_INTEGER', async () => {
        await wrapper.vm.onInputKeyDown({ code: 'Enter', target: { value: '123456789012345678' }, preventDefault: () => {} });

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['123456789012345678']);

        await wrapper.vm.onInputKeyDown({ code: 'Enter', target: { value: '999999999999999999' }, preventDefault: () => {} });

        expect(wrapper.emitted()['update:modelValue'][1]).toEqual(['999999999999999999']);
    });

    it('should step exactly beyond Number.MAX_SAFE_INTEGER', async () => {
        await wrapper.setProps({ modelValue: '123456789012345678' });

        await wrapper.vm.onInputKeyDown({ code: 'ArrowUp', target: { value: '123456789012345678' }, preventDefault: () => {} });

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['123456789012345679']);
    });

    it('should accept a string modelValue and render it exactly', async () => {
        await wrapper.setProps({ modelValue: '123456789012345678', locale: 'en-US' });

        expect(wrapper.find('input.p-inputnumber-input').element._value).toBe('123,456,789,012,345,678');
    });

    it('should clamp against string boundaries exactly', async () => {
        await wrapper.setProps({ modelValue: '999999999999999998', max: '999999999999999999' });

        await wrapper.vm.onInputKeyDown({ code: 'ArrowUp', target: { value: '999999999999999998' }, preventDefault: () => {} });

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['999999999999999999']);

        await wrapper.vm.onInputKeyDown({ code: 'ArrowUp', target: { value: '999999999999999999' }, preventDefault: () => {} });

        expect(wrapper.emitted()['update:modelValue'][1]).toEqual(['999999999999999999']);
    });

    it('should keep the minus sign after typing a negative zero', async () => {
        await wrapper.setProps({ modelValue: null });

        const input = wrapper.find('input.p-inputnumber-input').element;

        input.setSelectionRange(0, 0);

        await wrapper.vm.onInputKeyPress({ key: '-', preventDefault: () => {} });
        await wrapper.vm.onInputKeyPress({ key: '0', preventDefault: () => {} });

        expect(input.value).toBe('-0');
    });

    it('should emit a canonical zero for a typed negative zero', async () => {
        await wrapper.vm.onInputKeyDown({ code: 'Enter', target: { value: '-0' }, preventDefault: () => {} });

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([0]);
    });

    it('should not report a spurious change when spinning in a group-separator locale', async () => {
        // the locale groups with '.', so re-parsing '10.5' would read it as 105
        await wrapper.setProps({ modelValue: 10.5, locale: 'de-DE', max: 10.5, step: 1, minFractionDigits: 1 });

        const input = wrapper.find('input.p-inputnumber-input').element;

        await wrapper.vm.onInputKeyDown({ code: 'ArrowUp', target: input, preventDefault: () => {} });

        expect(wrapper.emitted().input).toBeUndefined();
    });

    it('should step down across zero by 0.1 without floating point drift', async () => {
        await wrapper.setProps({ modelValue: 0.3, step: 0.1, minFractionDigits: 1 });

        const input = wrapper.find('input.p-inputnumber-input').element;

        for (let i = 0; i < 5; i++) {
            await wrapper.vm.onInputKeyDown({ code: 'ArrowDown', target: input, preventDefault: () => {} });
        }

        const emitted = wrapper.emitted()['update:modelValue'].map(([value]) => value);

        // as doubles 0.3 - 0.1 is 0.19999999999999998
        expect(emitted).toEqual([0.2, 0.1, 0, -0.1, -0.2]);
    });

    it('should invert a negative string step when spinning', async () => {
        await wrapper.setProps({ modelValue: 5, step: '-2' });

        await wrapper.vm.onInputKeyDown({ code: 'ArrowDown', target: { value: 5 }, preventDefault: () => {} });

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([7]);

        await wrapper.vm.onInputKeyDown({ code: 'ArrowUp', target: { value: 7 }, preventDefault: () => {} });

        expect(wrapper.emitted()['update:modelValue'][1]).toEqual([5]);
    });

    it('should switch between a number and a string as the value crosses what a number holds', async () => {
        await wrapper.setProps({ modelValue: 9007199254740991 });

        await wrapper.vm.onInputKeyDown({ code: 'ArrowUp', target: { value: '9007199254740991' }, preventDefault: () => {} });
        await wrapper.vm.onInputKeyDown({ code: 'ArrowUp', target: { value: '9007199254740992' }, preventDefault: () => {} });
        await wrapper.vm.onInputKeyDown({ code: 'ArrowDown', target: { value: '9007199254740993' }, preventDefault: () => {} });

        expect(wrapper.emitted()['update:modelValue']).toEqual([[9007199254740992], ['9007199254740993'], [9007199254740992]]);
    });

    it('should compare a non-string current value exactly', () => {
        expect(wrapper.vm.isValueChanged(10.5, '10.50')).toBe(false);
        expect(wrapper.vm.isValueChanged(10.5, '10.6')).toBe(true);
        expect(wrapper.vm.isValueChanged(null, '1')).toBe(true);
    });

    describe('typing over initial zero', () => {
        const type = async (input, key) => {
            await wrapper.vm.onInputKeyPress({ key, preventDefault: () => {} });

            return { value: input.value, caret: input.selectionStart };
        };

        it('should keep multi char suffix when typing digits after zero', async () => {
            await wrapper.setProps({ modelValue: 0, suffix: ' kg' });

            const input = wrapper.find('input.p-inputnumber-input').element;

            expect(input.value).toBe('0 kg');

            input.setSelectionRange(1, 1);

            expect(await type(input, '1')).toEqual({ value: '1 kg', caret: 1 });
            expect(await type(input, '2')).toEqual({ value: '12 kg', caret: 2 });
            expect(await type(input, '3')).toEqual({ value: '123 kg', caret: 3 });
            expect(wrapper.emitted().input.map(([e]) => e.value)).toEqual([1, 12, 123]);
        });

        it('should keep multi char prefix and suffix when typing digits after zero', async () => {
            await wrapper.setProps({ modelValue: 0, prefix: '$ ', suffix: ' kg' });

            const input = wrapper.find('input.p-inputnumber-input').element;

            expect(input.value).toBe('$ 0 kg');

            input.setSelectionRange(3, 3);

            expect(await type(input, '1')).toEqual({ value: '$ 1 kg', caret: 3 });
            expect(await type(input, '2')).toEqual({ value: '$ 12 kg', caret: 4 });
            expect(wrapper.emitted().input.map(([e]) => e.value)).toEqual([1, 12]);
        });

        it('should keep typing into the integer part of a currency value', async () => {
            await wrapper.setProps({ modelValue: 0, mode: 'currency', currency: 'USD', locale: 'en-US' });

            const input = wrapper.find('input.p-inputnumber-input').element;

            expect(input.value).toBe('$0.00');

            input.setSelectionRange(2, 2);

            expect(await type(input, '1')).toEqual({ value: '$1.00', caret: 2 });
            expect(await type(input, '2')).toEqual({ value: '$12.00', caret: 3 });
            expect(await type(input, '5')).toEqual({ value: '$125.00', caret: 4 });
            expect(await type(input, '0')).toEqual({ value: '$1,250.00', caret: 6 });
            expect(wrapper.emitted().input.map(([e]) => e.value)).toEqual([1, 12, 125, 1250]);
        });

        it('should place caret after typed digit with single char suffix', async () => {
            await wrapper.setProps({ modelValue: 0, suffix: '%' });

            const input = wrapper.find('input.p-inputnumber-input').element;

            input.setSelectionRange(1, 1);

            expect(await type(input, '1')).toEqual({ value: '1%', caret: 1 });
            expect(await type(input, '2')).toEqual({ value: '12%', caret: 2 });
        });

        it('should still advance caret when overwriting fraction digits', async () => {
            await wrapper.setProps({ modelValue: 1, minFractionDigits: 2, maxFractionDigits: 2, locale: 'en-US', suffix: ' kg' });

            const input = wrapper.find('input.p-inputnumber-input').element;

            expect(input.value).toBe('1.00 kg');

            input.setSelectionRange(2, 2);

            expect(await type(input, '5')).toEqual({ value: '1.50 kg', caret: 3 });
            expect(await type(input, '7')).toEqual({ value: '1.57 kg', caret: 4 });
        });
    });
});
