import { mount } from '@vue/test-utils';
import PrimeVue from 'openvue/config';
import { beforeEach, expect } from 'vitest';
import BlockUI from './BlockUI.vue';

let wrapper = null;

describe('BlockUI.vue', () => {
    beforeEach(() => {
        wrapper = mount(BlockUI, {
            attachTo: document.body,
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            }
        });
    });

    afterEach(() => {
        wrapper?.unmount();
        wrapper = null;
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it('When blocked props is true, block method should be triggered on mounted hook', async () => {
        const blockUiSpy = vi.spyOn(BlockUI.methods, 'block');

        wrapper = mount(BlockUI, {
            props: {
                blocked: true
            }
        });

        expect(blockUiSpy).toHaveBeenCalled();
    });

    it('When blocked props value is changed, block or unblock method should be triggered', async () => {
        const blockSpy = vi.spyOn(wrapper.vm, 'block');
        const unblockSpy = vi.spyOn(wrapper.vm, 'unblock');

        await wrapper.setProps({ blocked: true });

        expect(blockSpy).toHaveBeenCalled();

        await wrapper.setProps({ blocked: false });

        expect(unblockSpy).toHaveBeenCalled();
    });

    it('When block method triggered, mask should be added on DOM', async () => {
        await wrapper.setProps({ fullScreen: true });
        await wrapper.vm.block();

        expect(document.querySelector('.p-blockui')).not.toBe(null);
    });

    it('When removeMask method triggered, isBlocked should be false and emitted', async () => {
        wrapper = mount(BlockUI, {
            props: {
                blocked: true
            },
            slots: {
                default: 'test'
            }
        });
        await wrapper.vm.removeMask();

        expect(wrapper.vm.isBlocked).toBe(false);
        expect(wrapper.emitted().unblock.length).toBe(1);
    });

    it('When blocked is toggled rapidly, only one mask should exist at a time', async () => {
        vi.useFakeTimers();

        wrapper = mount(BlockUI, {
            attachTo: document.body,
            slots: { default: '<button>test</button>' }
        });

        for (let i = 0; i < 10; i++) {
            await wrapper.setProps({ blocked: true });

            expect(wrapper.element.querySelectorAll('.p-blockui-mask').length).toBe(1);

            vi.advanceTimersByTime(5);
            await wrapper.setProps({ blocked: false });
            vi.advanceTimersByTime(5);

            expect(wrapper.element.querySelectorAll('.p-blockui-mask').length).toBeLessThanOrEqual(1);
        }
    });

    it('When unblock is requested, the mask should stop capturing pointer events before it is removed', async () => {
        vi.useFakeTimers();

        wrapper = mount(BlockUI, {
            attachTo: document.body,
            props: { blocked: true },
            slots: { default: '<button>test</button>' }
        });

        const mask = wrapper.element.querySelector('.p-blockui-mask');

        await wrapper.setProps({ blocked: false });

        expect(mask.style.pointerEvents).toBe('none');

        vi.advanceTimersByTime(300);

        expect(wrapper.element.querySelectorAll('.p-blockui-mask').length).toBe(0);
        expect(wrapper.vm.isBlocked).toBe(false);
        expect(wrapper.emitted().unblock.length).toBe(1);
    });

    it('When blocked again before the leave animation ends, the pending removal should not drop the new mask', async () => {
        vi.useFakeTimers();

        wrapper = mount(BlockUI, {
            attachTo: document.body,
            props: { blocked: true },
            slots: { default: '<button>test</button>' }
        });

        await wrapper.setProps({ blocked: false });
        await wrapper.setProps({ blocked: true });

        vi.advanceTimersByTime(500);

        expect(wrapper.element.querySelectorAll('.p-blockui-mask').length).toBe(1);
        expect(wrapper.vm.isBlocked).toBe(true);
        expect(wrapper.emitted().unblock).toBeUndefined();
    });

    it('When the component is unmounted while blocked, the mask and the body scroll lock should be released', async () => {
        const maskCount = () => document.querySelectorAll('.p-blockui-mask').length;
        const initialCount = maskCount();

        wrapper = mount(BlockUI, {
            attachTo: document.body,
            props: { blocked: true, fullScreen: true }
        });

        expect(maskCount()).toBe(initialCount + 1);
        expect(document.body.classList.contains('p-overflow-hidden')).toBe(true);

        wrapper.unmount();
        wrapper = null;

        expect(maskCount()).toBe(initialCount);
        expect(document.body.classList.contains('p-overflow-hidden')).toBe(false);
    });
});
