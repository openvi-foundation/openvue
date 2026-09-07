import { mount } from '@vue/test-utils';
import PrimeVue from 'openvue/config';
import Toast from '../toast/Toast.vue';
import ToastService from './ToastService';

describe('ToastService', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(Toast, {
            global: {
                plugins: [PrimeVue, ToastService],
                stubs: {
                    teleport: true,
                    transition: true
                }
            }
        });
    });

    it('should return the generated id of the message', async () => {
        const id = wrapper.vm.$toast.add({ severity: 'info', summary: 'Message', detail: 'Message Content' });

        await wrapper.vm.$nextTick();

        expect(id).not.toBe(undefined);
        expect(wrapper.findAll('.p-toast-message').length).toBe(1);
    });

    it('should return the id defined by the message', async () => {
        const id = wrapper.vm.$toast.add({ id: 'my-id', severity: 'info', summary: 'Message', detail: 'Message Content' });

        expect(id).toBe('my-id');
    });

    it('should generate unique ids for each message', () => {
        const first = wrapper.vm.$toast.add({ severity: 'info', summary: 'Message 1' });
        const second = wrapper.vm.$toast.add({ severity: 'info', summary: 'Message 2' });

        expect(first).not.toBe(second);
    });

    it('should remove the message with the returned id', async () => {
        const id = wrapper.vm.$toast.add({ severity: 'info', summary: 'Message', detail: 'Message Content' });

        wrapper.vm.$toast.add({ severity: 'info', summary: 'Other Message', detail: 'Message Content' });

        await wrapper.vm.$nextTick();
        expect(wrapper.findAll('.p-toast-message').length).toBe(2);

        wrapper.vm.$toast.remove({ id });

        await wrapper.vm.$nextTick();
        expect(wrapper.findAll('.p-toast-message').length).toBe(1);
        expect(wrapper.find('.p-toast-summary').text()).toBe('Other Message');
    });
});
