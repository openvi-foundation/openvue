import { mount } from '@vue/test-utils';
import PrimeVue from 'openvue/config';
import { nextTick } from 'vue';
import InputOtp from './InputOtp.vue';

describe('InputOtp.vue', () => {
    let wrapper;

    const mountInputOtp = (props = {}) =>
        mount(InputOtp, {
            attachTo: document.body,
            global: {
                plugins: [PrimeVue]
            },
            props: {
                modelValue: '1234',
                'onUpdate:modelValue': (value) => wrapper.setProps({ modelValue: value }),
                ...props
            }
        });

    beforeEach(() => {
        wrapper = mountInputOtp();
    });

    afterEach(() => {
        wrapper.unmount();
    });

    const inputs = () => wrapper.findAll('input').map((input) => input.element);

    const values = () => inputs().map((input) => input.value);

    const input = async (element, value, inputType) => {
        element.focus();
        element.value = value;
        element.dispatchEvent(new InputEvent('input', { inputType, bubbles: true }));
        await nextTick();
        await nextTick();
    };

    const keydown = (element, key) => {
        const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });

        element.focus();
        element.dispatchEvent(event);

        return event;
    };

    const paste = async (element, text) => {
        const event = new Event('paste', { bubbles: true, cancelable: true });

        Object.defineProperty(event, 'clipboardData', { value: { getData: () => text } });
        element.dispatchEvent(event);
        await nextTick();

        return event;
    };

    it('should exist', () => {
        expect(wrapper.find('.p-inputotp.p-component').exists()).toBe(true);
        expect(values()).toEqual(['1', '2', '3', '4']);
    });

    describe('props', () => {
        it('should render as many inputs as the length', () => {
            wrapper.unmount();
            wrapper = mountInputOtp({ modelValue: null, length: 6 });

            expect(inputs()).toHaveLength(6);
            expect(values()).toEqual(['', '', '', '', '', '']);
        });

        it('should render password inputs when masked', () => {
            wrapper.unmount();
            wrapper = mountInputOtp({ mask: true });

            expect(inputs().every((element) => element.type === 'password')).toBe(true);
        });

        it('should use a numeric input mode when integerOnly is set', async () => {
            expect(inputs()[0].getAttribute('inputmode')).toBe('text');

            await wrapper.setProps({ integerOnly: true });

            expect(inputs()[0].getAttribute('inputmode')).toBe('numeric');
        });
    });

    describe('typing', () => {
        beforeEach(() => {
            wrapper.unmount();
            wrapper = mountInputOtp({ modelValue: null });
        });

        it('should update the value and move the focus to the next input', async () => {
            await input(inputs()[0], '5', 'insertText');

            expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['5']);
            expect(document.activeElement).toBe(inputs()[1]);
        });

        it('should emit a change event with the new value', async () => {
            await input(inputs()[0], '5', 'insertText');

            expect(wrapper.emitted('change').at(-1)[0].value).toBe('5');
        });

        it('should prevent keys other than digits when integerOnly is set', async () => {
            await wrapper.setProps({ integerOnly: true });

            expect(keydown(inputs()[0], 'a').defaultPrevented).toBe(true);
            expect(keydown(inputs()[0], '1').defaultPrevented).toBe(false);
        });
    });

    describe('max length', () => {
        it('should prevent further characters when all inputs are filled', () => {
            const element = inputs()[3];

            element.focus();
            element.setSelectionRange(1, 1);

            expect(keydown(element, '5').defaultPrevented).toBe(true);
        });

        it('should allow replacing a selected character when all inputs are filled', () => {
            const element = inputs()[3];

            element.focus();
            element.setSelectionRange(0, 1);

            expect(keydown(element, '5').defaultPrevented).toBe(false);
        });
    });

    describe('navigation', () => {
        it('should move the focus with the arrow keys', () => {
            expect(keydown(inputs()[1], 'ArrowRight').defaultPrevented).toBe(true);
            expect(document.activeElement).toBe(inputs()[2]);

            expect(keydown(inputs()[1], 'ArrowLeft').defaultPrevented).toBe(true);
            expect(document.activeElement).toBe(inputs()[0]);
        });

        it('should prevent the up and down arrow keys', () => {
            expect(keydown(inputs()[1], 'ArrowUp').defaultPrevented).toBe(true);
            expect(keydown(inputs()[1], 'ArrowDown').defaultPrevented).toBe(true);
        });
    });

    describe('backspace key', () => {
        it('should move the focus to the previous input after deleting a value', async () => {
            await input(inputs()[3], '', 'deleteContentBackward');

            expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['123']);
            expect(document.activeElement).toBe(inputs()[2]);
        });

        it('should move the focus to the previous input when the input is empty', () => {
            wrapper.unmount();
            wrapper = mountInputOtp({ modelValue: '12' });

            expect(keydown(inputs()[2], 'Backspace').defaultPrevented).toBe(true);
            expect(document.activeElement).toBe(inputs()[1]);
        });
    });

    describe('delete key', () => {
        it('should remove the current value and shift the following values to the left', async () => {
            await input(inputs()[1], '', 'deleteContentForward');

            expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['134']);
            expect(values()).toEqual(['1', '3', '4', '']);
        });

        it('should keep the focus on the current input and select its value', async () => {
            const element = inputs()[1];

            await input(element, '', 'deleteContentForward');

            expect(document.activeElement).toBe(element);
            expect([element.selectionStart, element.selectionEnd]).toEqual([0, 1]);
        });

        it('should delete the following values when pressed repeatedly', async () => {
            const element = inputs()[1];

            await input(element, '', 'deleteContentForward');
            await input(element, '', 'deleteContentForward');

            expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['14']);
            expect(document.activeElement).toBe(element);
        });
    });

    describe('paste', () => {
        it('should fill the inputs and cut the value to the length', async () => {
            const event = await paste(inputs()[0], '567890');

            expect(event.defaultPrevented).toBe(true);
            expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['5678']);
            expect(values()).toEqual(['5', '6', '7', '8']);
        });

        it('should ignore non-numeric values when integerOnly is set', async () => {
            await wrapper.setProps({ integerOnly: true });
            await paste(inputs()[0], 'abcd');

            expect(wrapper.emitted('update:modelValue')).toBeUndefined();
            expect(values()).toEqual(['1', '2', '3', '4']);
        });

        it('should be ignored when readonly', async () => {
            await wrapper.setProps({ readonly: true });
            await paste(inputs()[0], '5678');

            expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        });
    });
});
