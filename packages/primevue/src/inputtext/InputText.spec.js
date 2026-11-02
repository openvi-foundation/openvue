import Form from '@openvue/forms/form';
import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import InputText from './InputText.vue';

describe('InputText.vue', () => {
    it('is InputText component exists', async () => {
        const wrapper = mount(InputText);

        expect(wrapper.find('.p-inputtext.p-component').exists()).toBe(true);

        await wrapper.setProps({ modelValue: 'PrimeVue' });

        expect(wrapper.find('.p-filled').exists()).toBe(true);

        const input = wrapper.find('input');

        expect(input.element.value).toEqual('PrimeVue');
    });

    it('input event', async () => {
        const wrapper = mount(InputText);
        const event = { target: { value: 'a' } };

        await wrapper.vm.onInput(event);

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['a']);
    });

    it('should filled work', async () => {
        const wrapper = mount(InputText);

        await wrapper.setProps({ modelValue: 'a' });

        expect(wrapper.vm.filled).toBe(true);
    });

    it('should stay empty after clearing inside Form with initialValues', async () => {
        const wrapper = mount({ render: () => h(Form, { initialValues: { name: 'abc' } }, () => h(InputText, { name: 'name' })) }, { attachTo: document.body });
        const inputText = wrapper.findComponent(InputText);
        const input = wrapper.find('input');

        expect(input.element.value).toBe('abc');

        for (const value of ['ab', 'a', '']) {
            await input.setValue(value);
            await nextTick();

            expect(input.element.value).toBe(value);
        }

        expect(inputText.vm.$filled).toBe(false);

        wrapper.unmount();
    });
});
