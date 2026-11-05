import { mount } from '@vue/test-utils';
import InputMask from './InputMask.vue';

describe('InputMask.vue', () => {
    it('should exist', async () => {
        const wrapper = mount(InputMask, {
            props: {
                modelValue: null,
                mask: '99-999999',
                placeholder: '99-999999'
            }
        });

        expect(wrapper.find('.p-inputmask.p-component').exists()).toBe(true);
        expect(wrapper.find('.p-inputmask.p-component').attributes().placeholder).toBe('99-999999');

        const event = { target: { value: '1' } };

        await wrapper.vm.onInput(event);

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['1']);
    });

    it('should not re-emit the old value when cleared externally with unmask', async () => {
        const wrapper = mount(InputMask, {
            props: {
                modelValue: null,
                mask: '99-999999',
                unmask: true
            }
        });

        const input = wrapper.find('input');

        input.element.value = '123';
        await wrapper.vm.onInput({ target: input.element });

        expect(wrapper.emitted()['update:modelValue'].at(-1)).toEqual(['123']);

        await wrapper.setProps({ modelValue: '12' });
        await wrapper.setProps({ modelValue: null });

        const emitted = wrapper.emitted()['update:modelValue'];

        expect(emitted.at(-1)).toEqual(['']);
        expect(input.element.value).toBe('');
    });

    it('keydown event', async () => {
        const wrapper = mount(InputMask, {
            props: {
                modelValue: null,
                mask: '99/99/9999'
            }
        });

        const event = { target: { value: '1' } };

        await wrapper.vm.onKeyDown(event);

        expect(wrapper.emitted().keydown[0]).toEqual([event]);
    });
});
