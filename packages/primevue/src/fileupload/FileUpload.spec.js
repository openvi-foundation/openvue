import { mount } from '@vue/test-utils';
import PrimeVue from 'openvue/config';
import FileUpload from './FileUpload.vue';

const mountFileUpload = (options = {}) =>
    mount(FileUpload, {
        global: {
            plugins: [PrimeVue]
        },
        ...options
    });

describe('FileUpload.vue', () => {
    it('should exist', () => {
        const wrapper = mountFileUpload();

        expect(wrapper.find('.p-fileupload.p-component').exists()).toBe(true);
        expect(wrapper.find('input[type="file"]').exists()).toBe(true);
    });

    describe('inputId', () => {
        it('should not render an id on the input by default', () => {
            const wrapper = mountFileUpload();

            expect(wrapper.find('input[type="file"]').attributes('id')).toBeUndefined();
        });

        it('should set the id on the input in advanced mode', () => {
            const wrapper = mountFileUpload({ props: { inputId: 'logo-upload' } });

            expect(wrapper.find('input[type="file"]').attributes('id')).toBe('logo-upload');
        });

        it('should set the id on the input in basic mode', () => {
            const wrapper = mountFileUpload({ props: { mode: 'basic', inputId: 'logo-upload' } });

            expect(wrapper.find('input[type="file"]').attributes('id')).toBe('logo-upload');
        });

        it('should not render an id on the input in basic mode by default', () => {
            const wrapper = mountFileUpload({ props: { mode: 'basic' } });

            expect(wrapper.find('input[type="file"]').attributes('id')).toBeUndefined();
        });

        it('should update the id when the prop changes', async () => {
            const wrapper = mountFileUpload({ props: { inputId: 'first' } });

            await wrapper.setProps({ inputId: 'second' });

            expect(wrapper.find('input[type="file"]').attributes('id')).toBe('second');

            await wrapper.setProps({ inputId: null });

            expect(wrapper.find('input[type="file"]').attributes('id')).toBeUndefined();
        });

        it('should link a label in the empty slot to the input', () => {
            const wrapper = mountFileUpload({
                props: { inputId: 'logo-upload' },
                slots: {
                    empty: '<label for="logo-upload">Browse folders</label>'
                },
                attachTo: document.body
            });

            const label = wrapper.find('label[for="logo-upload"]');
            const input = wrapper.find('input[type="file"]');

            expect(label.exists()).toBe(true);
            expect(label.element.control).toBe(input.element);

            wrapper.unmount();
        });

        it('should let a passthrough id override inputId', () => {
            const wrapper = mountFileUpload({
                props: {
                    inputId: 'logo-upload',
                    pt: { input: { id: 'pt-id' } }
                }
            });

            expect(wrapper.find('input[type="file"]').attributes('id')).toBe('pt-id');
        });
    });
});
