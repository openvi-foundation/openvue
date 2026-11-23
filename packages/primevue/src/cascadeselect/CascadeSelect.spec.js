import { OverlayRegistry } from '@openvue/core/utils';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import PrimeVue from 'openvue/config';
import CascadeSelect from './CascadeSelect.vue';

describe('CascadeSelect.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(CascadeSelect, {
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
                        name: 'Australia',
                        code: 'AU',
                        states: [
                            {
                                name: 'New South Wales',
                                cities: [
                                    { cname: 'Sydney', code: 'A-SY' },
                                    { cname: 'Newcastle', code: 'A-NE' },
                                    { cname: 'Wollongong', code: 'A-WO' }
                                ]
                            },
                            {
                                name: 'Queensland',
                                cities: [
                                    { cname: 'Brisbane', code: 'A-BR' },
                                    { cname: 'Townsville', code: 'A-TO' }
                                ]
                            }
                        ]
                    },
                    {
                        name: 'Canada',
                        code: 'CA',
                        states: [
                            {
                                name: 'Quebec',
                                cities: [
                                    { cname: 'Montreal', code: 'C-MO' },
                                    { cname: 'Quebec City', code: 'C-QU' }
                                ]
                            },
                            {
                                name: 'Ontario',
                                cities: [
                                    { cname: 'Ottawa', code: 'C-OT' },
                                    { cname: 'Toronto', code: 'C-TO' }
                                ]
                            }
                        ]
                    },
                    {
                        name: 'United States',
                        code: 'US',
                        states: [
                            {
                                name: 'California',
                                cities: [
                                    { cname: 'Los Angeles', code: 'US-LA' },
                                    { cname: 'San Diego', code: 'US-SD' },
                                    { cname: 'San Francisco', code: 'US-SF' }
                                ]
                            },
                            {
                                name: 'Florida',
                                cities: [
                                    { cname: 'Jacksonville', code: 'US-JA' },
                                    { cname: 'Miami', code: 'US-MI' },
                                    { cname: 'Tampa', code: 'US-TA' },
                                    { cname: 'Orlando', code: 'US-OR' }
                                ]
                            },
                            {
                                name: 'Texas',
                                cities: [
                                    { cname: 'Austin', code: 'US-AU' },
                                    { cname: 'Dallas', code: 'US-DA' },
                                    { cname: 'Houston', code: 'US-HO' }
                                ]
                            }
                        ]
                    }
                ],
                optionLabel: 'cname',
                optionGroupLabel: 'name',
                optionGroupChildren: ['states', 'cities']
            }
        });
    });

    it('should exist', () => {
        expect(wrapper.find('.p-cascadeselect.p-component').exists()).toBe(true);
    });

    it('should show list and sublist', async () => {
        expect(wrapper.find('.p-cascadeselect.p-component').exists()).toBe(true);

        await wrapper.trigger('click');

        expect(wrapper.find('.p-cascadeselect-list').exists()).toBe(true);
        expect(wrapper.findAll('.p-cascadeselect-option').length).toBe(3);
        expect(wrapper.findAll('.p-cascadeselect-option-text')[0].text()).toBe('Australia');

        const firstGroup = wrapper.findAll('.p-cascadeselect-option-content')[0];

        await firstGroup.trigger('click');

        expect(wrapper.find('.p-cascadeselect-list .p-cascadeselect-option-list').exists()).toBe(true);

        const sublist = wrapper.find('.p-cascadeselect-list .p-cascadeselect-option-list');

        expect(sublist.findAll('.p-cascadeselect-option').length).toBe(2);
        expect(sublist.findAll('.p-cascadeselect-option-text')[0].text()).toBe('New South Wales');
    });

    it('should accept custom icons', async () => {
        wrapper.setProps({
            dropdownIcon: 'pi pi-discord',
            optionGroupIcon: 'pi pi-bell'
        });

        await nextTick();

        expect(wrapper.find('.p-cascadeselect-dropdown-icon').classes()).toContain('pi-discord');

        await wrapper.trigger('click');

        expect(wrapper.find('.p-cascadeselect-group-icon').classes()).toContain('pi-bell');
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
            wrapper.vm.onOverlayLeave(overlay);
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
    });
});
