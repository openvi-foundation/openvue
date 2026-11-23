import { OverlayRegistry } from '@openvue/core/utils';
import { mount } from '@vue/test-utils';
import PrimeVue from 'openvue/config';
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

    describe('nested overlays', () => {
        let overlay;
        let owner;
        let nestedOverlay;

        beforeEach(async () => {
            vi.useFakeTimers();
            await wrapper.trigger('click');

            overlay = wrapper.vm.overlay;
            wrapper.vm.onOverlayEnter(overlay);
            wrapper.vm.onOverlayAfterEnter();

            owner = document.createElement('span');
            overlay.appendChild(owner);
            nestedOverlay = document.createElement('div');
            document.body.appendChild(nestedOverlay);
        });

        afterEach(() => {
            OverlayRegistry.unregister(nestedOverlay);
            nestedOverlay.remove();
            wrapper.vm.onOverlayLeave();
            vi.useRealTimers();
        });

        const press = (target) => target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, detail: 1 }));

        const clickOn = (target = document.body) => {
            press(target);
            target.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
            vi.runAllTimers();
        };

        it('should close on an outside click', () => {
            clickOn();

            expect(wrapper.vm.overlayVisible).toBe(false);
        });

        it('should close on the first outside click after a click inside the panel', () => {
            clickOn(overlay);

            expect(wrapper.vm.overlayVisible).toBe(true);

            clickOn();

            expect(wrapper.vm.overlayVisible).toBe(false);
        });

        it('should stay open when an overlay of a component inside the panel is clicked', () => {
            OverlayRegistry.register(nestedOverlay, owner);
            clickOn(nestedOverlay);

            expect(wrapper.vm.overlayVisible).toBe(true);
        });

        it('should stay open when an overlay of a component inside the panel closes before the click', () => {
            OverlayRegistry.register(nestedOverlay, owner);
            nestedOverlay.addEventListener('mousedown', () => OverlayRegistry.unregister(nestedOverlay), { once: true });
            clickOn(nestedOverlay);

            expect(wrapper.vm.overlayVisible).toBe(true);

            clickOn();

            expect(wrapper.vm.overlayVisible).toBe(false);
        });

        it('should close when an overlay of a component outside the panel is clicked', () => {
            OverlayRegistry.register(nestedOverlay, document.body);
            clickOn(nestedOverlay);

            expect(wrapper.vm.overlayVisible).toBe(false);
        });

        it('should close on a keyboard click on an overlay of a component inside the panel after it closed', () => {
            OverlayRegistry.register(nestedOverlay, owner);
            press(nestedOverlay);
            OverlayRegistry.unregister(nestedOverlay);
            document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            vi.runAllTimers();

            expect(wrapper.vm.overlayVisible).toBe(false);
        });

        it('should stay open on an outside click while an overlay of a component inside the panel is open', () => {
            OverlayRegistry.register(nestedOverlay, owner);
            clickOn();

            expect(wrapper.vm.overlayVisible).toBe(true);

            OverlayRegistry.unregister(nestedOverlay);
            clickOn();

            expect(wrapper.vm.overlayVisible).toBe(false);
        });

        it('should close on an outside click after an overlay of a component inside the panel was removed without unregistering', () => {
            OverlayRegistry.register(nestedOverlay, owner);
            nestedOverlay.remove();
            clickOn();

            expect(wrapper.vm.overlayVisible).toBe(false);
        });

        it('should close on an outside click while an element inside the panel is expanded', () => {
            owner.setAttribute('aria-expanded', 'true');
            clickOn();

            expect(wrapper.vm.overlayVisible).toBe(false);
        });
        it('should close on an outside click while a node is expanded', async () => {
            await wrapper.find('.p-tree-node-toggle-button').trigger('click');

            expect(overlay.querySelector('[role="treeitem"][aria-expanded="true"]')).not.toBeNull();

            clickOn();

            expect(wrapper.vm.overlayVisible).toBe(false);
        });
    });
});
