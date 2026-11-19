import { mount } from '@vue/test-utils';
import PrimeVue from 'openvue/config';
import OverlayEventBus from 'openvue/overlayeventbus';
import TreeSelect from './TreeSelect.vue';

describe('TreeSelect.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(TreeSelect, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: {
                modelValue: null,
                options: [
                    {
                        key: '0',
                        label: 'Documents',
                        children: [
                            { key: '0-0', label: 'Work' },
                            { key: '0-1', label: 'Home' }
                        ]
                    },
                    { key: '1', label: 'Events' }
                ],
                placeholder: 'Select Item'
            }
        });
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('should exist', () => {
        expect(wrapper.find('.p-treeselect.p-component').exists()).toBe(true);
        expect(wrapper.find('.p-treeselect-label').text()).toBe('Select Item');
    });

    describe('outside click', () => {
        let overlay;
        let nestedOverlay;

        beforeEach(async () => {
            vi.useFakeTimers();

            await wrapper.trigger('click');

            overlay = wrapper.vm.overlay;
            wrapper.vm.onOverlayEnter(overlay);
            wrapper.vm.onOverlayAfterEnter();

            nestedOverlay = document.createElement('div');
            document.body.appendChild(nestedOverlay);
        });

        afterEach(() => {
            wrapper.vm.onOverlayLeave();
            nestedOverlay.remove();
            vi.useRealTimers();
        });

        const outsideClick = (target = document.body) => {
            target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            vi.runAllTimers();
        };

        const clickOnNestedOverlay = (emitterTarget) => {
            nestedOverlay.addEventListener('mousedown', (e) => OverlayEventBus.emit('overlay-click', { originalEvent: e, target: emitterTarget }), { once: true });
            nestedOverlay.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            outsideClick(nestedOverlay);
        };

        it('should close on an outside click', () => {
            outsideClick();

            expect(wrapper.vm.overlayVisible).toBe(false);
        });

        it('should close on the first outside click after a click inside the panel', () => {
            outsideClick(overlay);

            expect(wrapper.vm.overlayVisible).toBe(true);

            outsideClick();

            expect(wrapper.vm.overlayVisible).toBe(false);
        });

        it('should close on an outside click while a node is expanded', async () => {
            await wrapper.find('.p-tree-node-toggle-button').trigger('click');

            expect(overlay.querySelector('[role="treeitem"][aria-expanded="true"]')).not.toBeNull();

            outsideClick();

            expect(wrapper.vm.overlayVisible).toBe(false);
        });

        it('should stay open when an overlay of a component inside the panel is clicked', () => {
            clickOnNestedOverlay(overlay.firstElementChild);

            expect(wrapper.vm.overlayVisible).toBe(true);
        });

        it('should close when an overlay of a component outside the panel is clicked', () => {
            clickOnNestedOverlay(document.body);

            expect(wrapper.vm.overlayVisible).toBe(false);
        });

        it('should close on a regular outside click after a nested overlay click', () => {
            clickOnNestedOverlay(overlay.firstElementChild);
            outsideClick();

            expect(wrapper.vm.overlayVisible).toBe(false);
        });

        it('should stay open on an outside click while an overlay of a component inside the panel is open', () => {
            const combobox = document.createElement('span');

            combobox.setAttribute('aria-expanded', 'true');
            overlay.appendChild(combobox);
            outsideClick();

            expect(wrapper.vm.overlayVisible).toBe(true);

            combobox.setAttribute('aria-expanded', 'false');
            outsideClick();

            expect(wrapper.vm.overlayVisible).toBe(false);
        });
    });
});
