import { mount } from '@vue/test-utils';
import FileUpload from './FileUpload.vue';

describe('FileUpload.vue', () => {
    it('should not set an id on the native input by default', () => {
        const wrapper = mount(FileUpload);

        expect(wrapper.find('input[type="file"]').attributes('id')).toBeUndefined();
    });

    it('should set inputId on the native input in advanced mode', () => {
        const wrapper = mount(FileUpload, {
            props: {
                inputId: 'logo-upload'
            }
        });

        expect(wrapper.find('input[type="file"]').attributes('id')).toBe('logo-upload');
    });

    it('should set inputId on the native input in basic mode', () => {
        const wrapper = mount(FileUpload, {
            props: {
                mode: 'basic',
                inputId: 'logo-upload'
            }
        });

        expect(wrapper.find('input[type="file"]').attributes('id')).toBe('logo-upload');
    });

    it('should open the file dialog when a custom label in the empty template is clicked', async () => {
        const wrapper = mount(FileUpload, {
            attachTo: document.body,
            props: {
                inputId: 'logo-upload'
            },
            slots: {
                empty: '<label for="logo-upload" class="custom-label">Browse folders</label>'
            }
        });
        const input = wrapper.find('input[type="file"]').element;
        const clickSpy = vi.fn();

        input.addEventListener('click', clickSpy);
        await wrapper.find('.custom-label').trigger('click');

        expect(clickSpy).toHaveBeenCalled();

        wrapper.unmount();
    });

    it('should expose callbacks to the empty template', async () => {
        const wrapper = mount(FileUpload, {
            slots: {
                empty: `<template #empty="{ chooseCallback, uploadCallback, clearCallback, files, uploadedFiles }">
                    <button class="custom-choose" @click="chooseCallback()">Choose</button>
                    <span class="callbacks">{{ [typeof uploadCallback, typeof clearCallback, files.length, uploadedFiles.length].join(',') }}</span>
                </template>`
            }
        });
        const clickSpy = vi.spyOn(wrapper.vm.$refs.fileInput, 'click');

        await wrapper.find('.custom-choose').trigger('click');

        expect(clickSpy).toHaveBeenCalled();
        expect(wrapper.find('.callbacks').text()).toBe('function,function,0,0');
    });

    it('should open the file dialog via the exposed choose method', () => {
        const wrapper = mount(FileUpload);
        const clickSpy = vi.spyOn(wrapper.vm.$refs.fileInput, 'click');

        wrapper.vm.choose();

        expect(clickSpy).toHaveBeenCalled();
    });
});
