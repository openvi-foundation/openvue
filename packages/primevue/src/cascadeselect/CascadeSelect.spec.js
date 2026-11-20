import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import PrimeVue from 'openvue/config';
import OverlayEventBus from 'openvue/overlayeventbus';
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
            wrapper.vm.onOverlayLeave(overlay);
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

        it('should close on an outside click while an option group is expanded', async () => {
            await wrapper.findAll('.p-cascadeselect-option-content')[0].trigger('click');

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
