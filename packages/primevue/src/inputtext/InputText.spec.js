import Form from '@openvue/forms/form';
import FormField from '@openvue/forms/formfield';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
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

    it('should unregister FormField when removed from the DOM', async () => {
        const visible = ref(true);

        const DynamicForm = defineComponent({
            setup() {
                return () =>
                    h(
                        Form,
                        { initialValues: { name: 'abc' }, onSubmit: () => {} },
                        {
                            default: () => (visible.value ? h(FormField, { name: 'name', initialValue: 'abc' }, { default: (fieldSlot) => h(InputText, { ...fieldSlot.props }) }) : null)
                        }
                    );
            }
        });

        const wrapper = mount(DynamicForm, { attachTo: document.body });
        const form = wrapper.findComponent(Form);

        await nextTick();
        expect(form.vm.getFieldState('name')?.value).toBe('abc');

        visible.value = false;
        await nextTick();
        await nextTick();

        expect(form.vm.getFieldState('name')).toBeUndefined();
        expect(form.vm.fields.name).toBeUndefined();

        wrapper.unmount();
    });

    it('should reindex FormField names when an array item is removed', async () => {
        const items = ref([
            { id: 1, name: 'A' },
            { id: 2, name: 'B' },
            { id: 3, name: 'C' },
            { id: 4, name: 'D' },
            { id: 5, name: 'E' }
        ]);

        const DynamicForm = defineComponent({
            setup() {
                return () =>
                    h(
                        Form,
                        {
                            initialValues: {
                                'items.0.name': 'A',
                                'items.1.name': 'B',
                                'items.2.name': 'C',
                                'items.3.name': 'D',
                                'items.4.name': 'E'
                            },
                            onSubmit: () => {}
                        },
                        {
                            default: () => items.value.map((item, index) => h(FormField, { key: item.id, name: `items.${index}.name`, initialValue: item.name }, { default: (fieldSlot) => h(InputText, { ...fieldSlot.props }) }))
                        }
                    );
            }
        });

        const wrapper = mount(DynamicForm, { attachTo: document.body });
        const form = wrapper.findComponent(Form);

        const flush = async () => {
            await nextTick();
            await nextTick();
        };

        await nextTick();

        // middle
        items.value = [items.value[0], items.value[2], items.value[3], items.value[4]];
        await flush();

        expect(Object.keys(form.vm.fields).sort()).toEqual(['items.0.name', 'items.1.name', 'items.2.name', 'items.3.name']);
        expect(form.vm.getFieldState('items.0.name')?.value).toBe('A');
        expect(form.vm.getFieldState('items.1.name')?.value).toBe('C');
        expect(form.vm.getFieldState('items.2.name')?.value).toBe('D');
        expect(form.vm.getFieldState('items.3.name')?.value).toBe('E');
        expect(form.vm.getFieldState('items.4.name')).toBeUndefined();

        // first
        items.value = [items.value[1], items.value[2], items.value[3]];
        await flush();

        expect(Object.keys(form.vm.fields).sort()).toEqual(['items.0.name', 'items.1.name', 'items.2.name']);
        expect(form.vm.getFieldState('items.0.name')?.value).toBe('C');
        expect(form.vm.getFieldState('items.1.name')?.value).toBe('D');
        expect(form.vm.getFieldState('items.2.name')?.value).toBe('E');
        expect(form.vm.getFieldState('items.3.name')).toBeUndefined();

        // last
        items.value = [items.value[0], items.value[1]];
        await flush();

        expect(Object.keys(form.vm.fields).sort()).toEqual(['items.0.name', 'items.1.name']);
        expect(form.vm.getFieldState('items.0.name')?.value).toBe('C');
        expect(form.vm.getFieldState('items.1.name')?.value).toBe('D');
        expect(form.vm.getFieldState('items.2.name')).toBeUndefined();

        wrapper.unmount();
    });
});
