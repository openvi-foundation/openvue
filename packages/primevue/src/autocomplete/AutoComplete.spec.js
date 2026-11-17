import { mount } from '@vue/test-utils';
import PrimeVue from 'openvue/config';
import OverlayEventBus from 'openvue/overlayeventbus';
import { nextTick } from 'vue';
import AutoComplete from './AutoComplete.vue';

describe('AutoComplete.vue', () => {
    let wrapper;

    beforeEach(async () => {
        wrapper = mount(AutoComplete, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: {
                suggestions: null,
                field: 'name'
            },
            data() {
                return {
                    countries: [
                        { name: 'Afghanistan', code: 'AF' },
                        { name: 'Bahrain', code: 'BH' },
                        { name: 'Chile', code: 'CL' },
                        { name: 'Denmark', code: 'DK' }
                    ]
                };
            }
        });

        await wrapper.trigger('click');
    });

    it('should exists', () => {
        expect(wrapper.find('.p-autocomplete.p-component').exists()).toBe(true);
        expect(wrapper.find('.p-autocomplete-input').exists()).toBe(true);
    });

    it('search complete', async () => {
        const event = { target: { value: 'b' } };

        wrapper.vm.onInput(event);
        await wrapper.vm.$nextTick();

        wrapper.vm.search(event, event.target.value, 'input');
        await wrapper.vm.$nextTick();

        await wrapper.setProps({
            suggestions: [{ name: 'Bahrain', code: 'BH' }]
        });

        expect(wrapper.find('.p-autocomplete-list').exists()).toBe(true);
        expect(wrapper.findAll('.p-autocomplete-option').length).toBe(1);
    });

    it('should show overlay and empty-message if there are no suggestions', async () => {
        const event = { target: { value: 'b' } };

        wrapper.vm.search(event, event.target.value, 'input');
        await wrapper.vm.$nextTick();

        await wrapper.setProps({
            suggestions: []
        });

        expect(wrapper.find('.p-autocomplete-list').exists()).toBe(true);
        expect(wrapper.findAll('.p-autocomplete-option').length).toBe(0);
        expect(wrapper.find('.p-autocomplete-empty-message').exists()).toBe(true);
    });

    it('dropdown', () => {
        it('should have correct custom icon', async () => {
            wrapper.setProps({
                dropdown: true,
                dropdownIcon: 'pi pi-discord'
            });

            await nextTick();

            const token = wrapper.find('.p-button').find('span');

            expect(token.classes()).toContain('pi-discord');
        });
    });

    it('multiple', () => {
        it('should have correct custom icon', async () => {
            wrapper.setProps({
                multiple: true,
                removeTokenIcon: 'pi pi-discord',
                modelValue: ['foo', 'bar']
            });

            await nextTick();

            wrapper.findAll('.p-autocomplete-token-icon').forEach((tokenIcon) => {
                expect(tokenIcon.classes()).toContain('pi-discord');
            });
        });
    });

    describe('nested overlays', () => {
        let overlay;
        let nestedOverlay;

        beforeEach(async () => {
            vi.useFakeTimers();

            const event = { target: { value: 'b' } };

            wrapper.vm.search(event, event.target.value, 'input');
            await wrapper.setProps({ suggestions: [{ name: 'Bahrain', code: 'BH' }] });

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
