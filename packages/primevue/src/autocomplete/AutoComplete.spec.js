import { OverlayRegistry } from '@openvue/core/utils';
import { mount } from '@vue/test-utils';
import PrimeVue from 'openvue/config';
import { nextTick, reactive, toRaw } from 'vue';
import AutoComplete from './AutoComplete.vue';

window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
};

const cities = () => [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
];

const cityNames = () => cities().map((city) => city.name);

const mountAutoComplete = (props = {}, component = AutoComplete) =>
    mount(component, {
        global: {
            plugins: [PrimeVue],
            stubs: {
                teleport: true
            }
        },
        props: { multiple: true, suggestions: cities(), optionLabel: 'name', ...props }
    });

const openOverlay = async (wrapper) => {
    wrapper.vm.show();
    await nextTick();
};

// The labels of the rendered options shown as selected. Fails if aria-selected, data-p-selected and the selected
// class disagree, since each of them asks isSelected on its own.
const selectedLabels = (wrapper) =>
    wrapper
        .findAll('li.p-autocomplete-option')
        .filter((option) => {
            const selected = option.attributes('aria-selected') === 'true';

            expect(option.attributes('data-p-selected')).toBe(String(selected));
            expect(option.classes('p-autocomplete-option-selected')).toBe(selected);

            return selected;
        })
        .map((option) => option.attributes('aria-label'));

const lastEmittedValue = (wrapper) => wrapper.emitted('update:modelValue').at(-1)[0];

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
        let owner;
        let nestedOverlay;

        beforeEach(async () => {
            vi.useFakeTimers();
            const event = { target: { value: 'b' } };

            wrapper.vm.search(event, event.target.value, 'input');
            await wrapper.setProps({ suggestions: [{ name: 'Bahrain', code: 'BH' }] });

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

describe('AutoComplete.vue selection', () => {
    describe('multiple selection', () => {
        it('should match primitive values', async () => {
            const wrapper = mountAutoComplete({ suggestions: cityNames(), optionLabel: undefined, modelValue: ['Rome', 'Paris'] });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
        });

        it('should not compare each suggestion against every selected value while rendering', async () => {
            // Guards #728: a per-row scan of the selection made the overlay slow to open with many selected values.
            const wrapper = mountAutoComplete({ suggestions: cityNames(), optionLabel: undefined, modelValue: ['Rome'] });
            const isEquals = vi.spyOn(wrapper.vm, 'isEquals');

            await openOverlay(wrapper);
            await wrapper.setProps({ modelValue: ['Rome', 'Paris'] });

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
            expect(isEquals).not.toHaveBeenCalled();
        });

        it('should not compare suggestions selected by reference or by dataKey while rendering', async () => {
            const suggestions = cities();
            const byReference = mountAutoComplete({ suggestions, modelValue: [...suggestions] });
            const byDataKey = mountAutoComplete({ dataKey: 'code', modelValue: cities().map(({ code }) => ({ code })) });
            const referenceEquals = vi.spyOn(byReference.vm, 'isEquals');
            const dataKeyEquals = vi.spyOn(byDataKey.vm, 'isEquals');

            await openOverlay(byReference);
            await openOverlay(byDataKey);

            expect(selectedLabels(byReference)).toEqual(cityNames());
            expect(selectedLabels(byDataKey)).toEqual(cityNames());
            expect(referenceEquals).not.toHaveBeenCalled();
            expect(dataKeyEquals).not.toHaveBeenCalled();
        });

        it('should match suggestion objects by reference', async () => {
            const suggestions = cities();
            const wrapper = mountAutoComplete({ suggestions, modelValue: [suggestions[1], suggestions[4]] });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
        });

        it('should match suggestion objects held in a reactive modelValue by reference', async () => {
            // Items read from a reactive array are proxies, not the suggestion objects themselves.
            const suggestions = cities();
            const wrapper = mountAutoComplete({ suggestions, modelValue: reactive([suggestions[1], suggestions[4]]) });
            const isEquals = vi.spyOn(wrapper.vm, 'isEquals');

            await openOverlay(wrapper);

            const comparedSuggestions = new Set(isEquals.mock.calls.map(([, optionValue]) => toRaw(optionValue)));

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
            // Only the unselected suggestions are compared, since they may still match an equal copy.
            expect([...comparedSuggestions]).toEqual([suggestions[0], suggestions[2], suggestions[3]]);
        });

        it('should match equal copies of suggestion objects by deep equality', async () => {
            // New suggestions arrive as new objects on every search, so this is the usual case without dataKey.
            const wrapper = mountAutoComplete({
                modelValue: [
                    { name: 'Rome', code: 'RM' },
                    { name: 'Paris', code: 'PRS' }
                ]
            });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
        });

        it('should not match a copy that differs in any field without dataKey', async () => {
            const wrapper = mountAutoComplete({ modelValue: [{ name: 'Rome (copy)', code: 'RM' }] });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual([]);
        });

        it('should match suggestion objects by dataKey only', async () => {
            const wrapper = mountAutoComplete({ dataKey: 'code', modelValue: [{ name: 'Rome (copy)', code: 'RM' }, { code: 'PRS' }] });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
        });

        it('should not match a typed value against suggestion objects', async () => {
            // Without typeahead, Enter adds the typed text itself to the selection.
            const wrapper = mountAutoComplete({ modelValue: ['Rome', { name: 'Paris', code: 'PRS' }] });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['Paris']);
        });

        it('should keep disabled suggestions shown as selected', async () => {
            const suggestions = cities();

            suggestions[1].disabled = true;

            const wrapper = mountAutoComplete({ suggestions, dataKey: 'code', optionDisabled: 'disabled', modelValue: [{ code: 'NY' }, { code: 'RM' }] });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['New York', 'Rome']);
        });

        it('should match suggestions inside groups', async () => {
            const wrapper = mountAutoComplete({
                suggestions: [
                    { label: 'Italy', items: ['Milan', 'Rome'] },
                    { label: 'UK', items: ['Leeds', 'London'] }
                ],
                optionLabel: undefined,
                optionGroupLabel: 'label',
                optionGroupChildren: 'items',
                modelValue: ['Rome', 'Leeds']
            });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Leeds']);
        });

        it('should update when modelValue is replaced', async () => {
            const wrapper = mountAutoComplete({ dataKey: 'code', modelValue: [{ code: 'RM' }] });

            await openOverlay(wrapper);
            await wrapper.setProps({ modelValue: [{ code: 'LDN' }, { code: 'IST' }] });

            expect(selectedLabels(wrapper)).toEqual(['London', 'Istanbul']);
        });

        it('should update when the modelValue array is changed in place', async () => {
            const modelValue = reactive(['Rome']);
            const wrapper = mountAutoComplete({ suggestions: cityNames(), optionLabel: undefined, modelValue });

            await openOverlay(wrapper);

            modelValue.push('Paris');
            await nextTick();
            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);

            // Same length, different content: catches lookups that only watch the array length.
            modelValue[0] = 'London';
            await nextTick();
            expect(selectedLabels(wrapper)).toEqual(['London', 'Paris']);

            modelValue.splice(1, 1);
            await nextTick();
            expect(selectedLabels(wrapper)).toEqual(['London']);
        });

        it('should update when the dataKey changes', async () => {
            const wrapper = mountAutoComplete({
                dataKey: 'code',
                modelValue: [
                    { name: 'Rome (copy)', code: 'RM' },
                    { name: 'Paris', code: 'PRS' }
                ]
            });

            await openOverlay(wrapper);
            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);

            await wrapper.setProps({ dataKey: null });
            expect(selectedLabels(wrapper)).toEqual(['Paris']);
        });

        it('should update when multiple is toggled', async () => {
            const wrapper = mountAutoComplete({ multiple: false, suggestions: cityNames(), optionLabel: undefined, modelValue: 'Rome' });

            await openOverlay(wrapper);
            expect(selectedLabels(wrapper)).toEqual(['Rome']);

            await wrapper.setProps({ multiple: true, modelValue: ['London'] });
            expect(selectedLabels(wrapper)).toEqual(['London']);
        });

        it('should add an unselected suggestion on click and not add a selected one again', async () => {
            const wrapper = mountAutoComplete({ modelValue: [{ name: 'Rome', code: 'RM' }] });

            await openOverlay(wrapper);
            await wrapper.findAll('li.p-autocomplete-option')[1].trigger('click');
            expect(wrapper.emitted('update:modelValue')).toBeUndefined();

            await wrapper.findAll('li.p-autocomplete-option')[4].trigger('click');
            expect(lastEmittedValue(wrapper)).toEqual([{ name: 'Rome', code: 'RM' }, cities()[4]]);
        });

        it('should render the selection correctly with the virtual scroller', async () => {
            const suggestions = Array.from({ length: 1000 }, (_, i) => ({ name: `Item #${i}`, value: i }));
            const modelValue = suggestions.filter((suggestion) => suggestion.value % 2 === 0).map(({ value }) => ({ value }));
            const wrapper = mountAutoComplete({ suggestions, dataKey: 'value', modelValue, virtualScrollerOptions: { itemSize: 38 } });

            await openOverlay(wrapper);

            // jsdom has no layout, so the scroller can't work out its viewport. Set the rendered range by hand,
            // far down the list, as if the user had scrolled there.
            const scroller = wrapper.vm.virtualScroller;

            scroller.first = 900;
            scroller.last = 920;
            await nextTick();

            const rendered = wrapper.findAll('li.p-autocomplete-option');

            expect(rendered.map((option) => option.attributes('aria-label'))).toEqual(Array.from({ length: 20 }, (_, i) => `Item #${900 + i}`));
            rendered.forEach((option) => {
                const index = Number(option.attributes('aria-posinset')) - 1;

                expect(option.attributes('aria-selected')).toBe(String(index % 2 === 0));
            });
        });
    });

    describe('selected option index', () => {
        it('should return -1 from findSelectedOptionIndex when nothing is selected', () => {
            const wrapper = mountAutoComplete({ dataKey: 'code', modelValue: [] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(-1);
        });

        it('should return the first selected suggestion in suggestion order from findSelectedOptionIndex', () => {
            const wrapper = mountAutoComplete({ suggestions: cityNames(), optionLabel: undefined, modelValue: ['Paris', 'London'] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(2);
        });

        it('should find equal copies in findSelectedOptionIndex without dataKey', () => {
            const wrapper = mountAutoComplete({ modelValue: [{ name: 'Istanbul', code: 'IST' }] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(3);
        });

        it('should skip selected values that match no suggestion in findSelectedOptionIndex', () => {
            const wrapper = mountAutoComplete({ dataKey: 'code', modelValue: [{ code: 'XX' }, { code: 'IST' }] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(3);
        });

        it('should skip disabled suggestions in findSelectedOptionIndex', () => {
            const suggestions = cities();

            suggestions[1].disabled = true;

            const wrapper = mountAutoComplete({ suggestions, dataKey: 'code', optionDisabled: 'disabled', modelValue: [{ code: 'RM' }, { code: 'PRS' }] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(4);
        });

        it('should focus the first selected suggestion on open with autoOptionFocus', async () => {
            const wrapper = mountAutoComplete({ dataKey: 'code', modelValue: [{ code: 'PRS' }, { code: 'RM' }], autoOptionFocus: true });

            await openOverlay(wrapper);

            expect(wrapper.vm.focusedOptionIndex).toBe(1);
        });

        it('should find the next and previous selected suggestions', () => {
            const wrapper = mountAutoComplete({ suggestions: cityNames(), optionLabel: undefined, modelValue: ['New York', 'Istanbul'] });

            expect(wrapper.vm.findNextSelectedOptionIndex(1)).toBe(3);
            expect(wrapper.vm.findNextSelectedOptionIndex(3)).toBe(-1);
            expect(wrapper.vm.findPrevSelectedOptionIndex(3)).toBe(0);
            expect(wrapper.vm.findPrevSelectedOptionIndex(0)).toBe(-1);
        });
    });

    describe('range selection', () => {
        it('should select a range up to the nearest selected suggestion', () => {
            const wrapper = mountAutoComplete({ suggestions: cityNames(), optionLabel: undefined, modelValue: ['Rome'] });

            wrapper.vm.onOptionSelectRange({}, -1, 3);

            expect(lastEmittedValue(wrapper)).toEqual(['Rome', 'London', 'Istanbul']);
        });

        it('should select a range down to the nearest selected suggestion', () => {
            const wrapper = mountAutoComplete({ suggestions: cityNames(), optionLabel: undefined, modelValue: ['Istanbul'] });

            wrapper.vm.onOptionSelectRange({}, 0, -1);

            expect(lastEmittedValue(wrapper)).toEqual(['Istanbul', 'New York', 'Rome', 'London']);
        });

        it('should not compare each suggestion against every selected value when selecting a range or focusing on open', async () => {
            const wrapper = mountAutoComplete({ dataKey: 'code', modelValue: [{ code: 'LDN' }, { code: 'PRS' }], autoOptionFocus: true });
            const isEquals = vi.spyOn(wrapper.vm, 'isEquals');

            await openOverlay(wrapper);
            expect(wrapper.vm.focusedOptionIndex).toBe(2);

            wrapper.vm.onOptionSelectRange({}, -1, 0);
            expect(lastEmittedValue(wrapper)).toEqual([{ code: 'LDN' }, { code: 'PRS' }, cities()[0], cities()[1]]);
            expect(isEquals).not.toHaveBeenCalled();
        });

        it('should not add suggestions selected by dataKey again', () => {
            const suggestions = cities();
            const wrapper = mountAutoComplete({ suggestions, dataKey: 'code', modelValue: [{ code: 'RM' }, { code: 'LDN' }] });

            wrapper.vm.onOptionSelectRange({}, 0, 3);

            expect(lastEmittedValue(wrapper)).toEqual([{ code: 'RM' }, { code: 'LDN' }, suggestions[0], suggestions[3]]);
        });

        it('should not add equal copies of selected suggestions again without dataKey', () => {
            const suggestions = cities();
            const wrapper = mountAutoComplete({ suggestions, modelValue: [{ name: 'Rome', code: 'RM' }] });

            wrapper.vm.onOptionSelectRange({}, -1, 3);

            expect(lastEmittedValue(wrapper)).toEqual([{ name: 'Rome', code: 'RM' }, suggestions[2], suggestions[3]]);
        });

        it('should skip disabled suggestions in a range', () => {
            const suggestions = cities();

            suggestions[2].disabled = true;

            const wrapper = mountAutoComplete({ suggestions, dataKey: 'code', optionDisabled: 'disabled', modelValue: [] });

            wrapper.vm.onOptionSelectRange({}, 1, 3);

            expect(lastEmittedValue(wrapper)).toEqual([suggestions[1], suggestions[3]]);
        });
    });

    describe('overridden isEquals', () => {
        // A component that extends AutoComplete with its own equality rule, here case-insensitive values.
        const CaseInsensitiveAutoComplete = {
            extends: AutoComplete,
            render: AutoComplete.render,
            methods: {
                isEquals(value1, value2) {
                    return String(value1).toLowerCase() === String(value2).toLowerCase();
                }
            }
        };

        const mountCaseInsensitive = (props) => mountAutoComplete({ suggestions: cityNames(), optionLabel: undefined, ...props }, CaseInsensitiveAutoComplete);

        it('should use the overridden isEquals to show selected suggestions', async () => {
            const wrapper = mountCaseInsensitive({ modelValue: ['rome', 'PARIS'] });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
        });

        it('should use the overridden isEquals in findSelectedOptionIndex and range selection', () => {
            const wrapper = mountCaseInsensitive({ modelValue: ['london'] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(2);

            wrapper.vm.onOptionSelectRange({}, -1, 4);
            expect(lastEmittedValue(wrapper)).toEqual(['london', 'Istanbul', 'Paris']);
        });
    });

    describe('single selection', () => {
        it('should match a primitive value', async () => {
            const wrapper = mountAutoComplete({ multiple: false, suggestions: cityNames(), optionLabel: undefined, modelValue: 'Rome' });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['Rome']);
        });

        it('should match an equal copy of a suggestion object', async () => {
            const wrapper = mountAutoComplete({ multiple: false, modelValue: { name: 'Rome', code: 'RM' } });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['Rome']);
        });
    });
});
