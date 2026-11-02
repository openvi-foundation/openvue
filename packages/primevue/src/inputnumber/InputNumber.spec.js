import Form from '@openvue/forms/form';
import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
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

    describe('inside Form with initialValues', () => {
        let formWrapper;

        beforeEach(() => {
            formWrapper = mount({ render: () => h(Form, { initialValues: { amount: 555 } }, () => h(InputNumber, { name: 'amount' })) }, { attachTo: document.body });
        });

        afterEach(() => {
            formWrapper.unmount();
        });

        it('should stay empty after deleting the last character', async () => {
            const inputNumber = formWrapper.findComponent(InputNumber);
            const input = formWrapper.find('input.p-inputnumber-input').element;

            expect(input.value).toBe('555');

            for (const expected of ['55', '5', '']) {
                input.setSelectionRange(input.value.length, input.value.length);
                await inputNumber.vm.onInputKeyDown({ code: 'Backspace', target: input, preventDefault: () => {} });
                await nextTick();

                expect(input.value).toBe(expected);
            }

            await inputNumber.vm.onInputBlur({ target: input });
            await nextTick();

            expect(input.value).toBe('');
        });

        it('should match standalone v-model behavior when deleting the last character', async () => {
            const standalone = mount(InputNumber, { props: { modelValue: 555 }, attachTo: document.body });
            const input = standalone.find('input.p-inputnumber-input').element;

            for (let i = 0; i < 3; i++) {
                input.setSelectionRange(input.value.length, input.value.length);
                await standalone.vm.onInputKeyDown({ code: 'Backspace', target: input, preventDefault: () => {} });
                await nextTick();
            }

            expect(input.value).toBe('');

            standalone.unmount();
        });
    });
});
