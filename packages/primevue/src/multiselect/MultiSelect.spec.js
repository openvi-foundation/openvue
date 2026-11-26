import { OverlayRegistry } from '@openvue/core/utils';
import { mount } from '@vue/test-utils';
import PrimeVue from 'openvue/config';
import { nextTick, reactive, toRaw } from 'vue';
import MultiSelect from './MultiSelect.vue';

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

const groupedCities = () => [
    {
        label: 'Germany',
        code: 'DE',
        items: [
            { label: 'Berlin', value: 'Berlin' },
            { label: 'Frankfurt', value: 'Frankfurt' },
            { label: 'Hamburg', value: 'Hamburg' },
            { label: 'Munich', value: 'Munich' }
        ]
    },
    {
        label: 'USA',
        code: 'US',
        items: [
            { label: 'Chicago', value: 'Chicago' },
            { label: 'Los Angeles', value: 'Los Angeles' },
            { label: 'New York', value: 'New York' },
            { label: 'San Francisco', value: 'San Francisco' }
        ]
    }
];

const mountMultiSelect = (props = {}, component = MultiSelect) =>
    mount(component, {
        global: { plugins: [PrimeVue], stubs: { teleport: true } },
        props: { options: cities(), optionLabel: 'name', placeholder: 'Select Cities', ...props }
    });

const openOverlay = async (wrapper) => {
    wrapper.vm.show();
    await nextTick();
};

const renderedLabels = (wrapper) => wrapper.findAll('li.p-multiselect-option').map((option) => option.attributes('aria-label'));

// Also checks that each row's checkbox agrees with its aria-selected.
const selectedLabels = (wrapper) =>
    wrapper
        .findAll('li.p-multiselect-option')
        .filter((option) => {
            const selected = option.attributes('aria-selected') === 'true';

            expect(option.find('input[type="checkbox"]').element.checked).toBe(selected);

            return selected;
        })
        .map((option) => option.attributes('aria-label'));

const headerCheckbox = (wrapper) => wrapper.find('.p-multiselect-header input[type="checkbox"]');

const selectedLabel = (wrapper) => wrapper.find('.p-multiselect-label').text();

const lastEmittedValue = (wrapper) => wrapper.emitted('update:modelValue').at(-1)[0];

describe('MultiSelect.vue', () => {
    let wrapper;

    beforeEach(async () => {
        wrapper = mount(MultiSelect, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: {
                modelValue: null,
                options: [
                    { name: 'New York', code: 'NY' },
                    { name: 'Rome', code: 'RM' },
                    { name: 'London', code: 'LDN' },
                    { name: 'Istanbul', code: 'IST' },
                    { name: 'Paris', code: 'PRS' }
                ],
                optionLabel: 'name',
                placeholder: 'Select Cities',
                highlightOnSelect: true
            }
        });
    });

    it('should exist', async () => {
        expect(wrapper.find('.p-multiselect.p-component').exists()).toBe(true);
        expect(wrapper.find('.p-multiselect-label.p-placeholder').text()).toBe('Select Cities');
        expect(wrapper.find('.p-multiselect-panel').exists()).toBe(false);

        await wrapper.vm.$refs.container.click();

        expect(wrapper.findAll('li.p-multiselect-option').length).toBe(5);
        expect(wrapper.findAll('li.p-multiselect-option')[0].attributes()['aria-label']).toBe('New York');
        expect(wrapper.findAll('li.p-multiselect-option')[0].text()).toBe('New York');
    });

    it('should select an item', async () => {
        await wrapper.vm.onOptionSelect({}, wrapper.vm.options[0]);

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([[wrapper.vm.options[0]]]);

        await wrapper.setProps({ modelValue: [wrapper.vm.options[0]] });
        await wrapper.vm.$refs.container.click();

        expect(wrapper.findAll('li.p-multiselect-option')[0].attributes()['data-p-selected']).toBe('true');
        expect(wrapper.find('.p-multiselect-label').text()).toBe('New York');
    });

    it('should select multiple item', async () => {
        await wrapper.setProps({ modelValue: [wrapper.vm.options[0]] });

        await wrapper.vm.onOptionSelect({}, wrapper.vm.options[1]);

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([[wrapper.vm.options[0], wrapper.vm.options[1]]]);

        await wrapper.setProps({ modelValue: [wrapper.vm.options[0], wrapper.vm.options[1]] });
        await wrapper.vm.$refs.container.click();

        expect(wrapper.findAll('li.p-multiselect-option')[0].attributes()['data-p-selected']).toBe('true');
        expect(wrapper.findAll('li.p-multiselect-option')[1].attributes()['data-p-selected']).toBe('true');
    });

    it('should show the placeholder when the selected value is not among the options', async () => {
        await wrapper.setProps({ optionValue: 'code', modelValue: ['XX'] });

        expect(wrapper.find('.p-multiselect-label').text()).toBe('Select Cities');
    });

    it('should skip selected values that are not among the options', async () => {
        await wrapper.setProps({ optionValue: 'code', modelValue: ['NY', 'XX', 'RM'] });

        expect(wrapper.find('.p-multiselect-label').text()).toBe('New York, Rome');
    });

    it('should not count selected values that are not among the options', async () => {
        await wrapper.setProps({ optionValue: 'code', modelValue: ['NY', 'XX', 'RM'], maxSelectedLabels: 1 });

        expect(wrapper.find('.p-multiselect-label').text()).toBe('2 items selected');
    });

    it('should not show chips for selected values that are not among the options', async () => {
        await wrapper.setProps({ optionValue: 'code', modelValue: ['NY', 'XX'], display: 'chip' });

        expect(wrapper.findAll('.p-multiselect-chip-item').length).toBe(1);
    });

    it('should show the placeholder in chip mode when the selected value is not among the options', async () => {
        await wrapper.setProps({ optionValue: 'code', modelValue: ['XX'], display: 'chip' });

        expect(wrapper.find('.p-multiselect-label').text()).toBe('Select Cities');
    });

    it('should show the empty label when the selected value is not among the options and there is no placeholder', async () => {
        await wrapper.setProps({ optionValue: 'code', modelValue: ['XX'], placeholder: null });

        expect(wrapper.find('.p-multiselect-label').classes()).toContain('p-multiselect-label-empty');
    });

    it('should show the placeholder once in chip mode while loading', async () => {
        await wrapper.setProps({ optionValue: 'code', modelValue: ['NY'], display: 'chip', loading: true, options: [] });

        expect(wrapper.find('.p-multiselect-label').text()).toBe('Select Cities');
    });

    it('should not toggle the focused option on Tab', async () => {
        const selectedOptions = wrapper.vm.options.slice(0, 3);

        await wrapper.setProps({
            modelValue: selectedOptions,
            showToggleAll: false
        });

        wrapper.vm.overlayVisible = true;
        wrapper.vm.focusedOptionIndex = 0;
        vi.spyOn(wrapper.vm, 'hasFocusableElements').mockReturnValue(false);

        const hideSpy = vi.spyOn(wrapper.vm, 'hide');

        wrapper.vm.onTabKey({ shiftKey: false, preventDefault: vi.fn() });

        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect(hideSpy).toHaveBeenCalledWith(wrapper.vm.filter);
    });

    it('should not toggle the first option when tabbing past a closed MultiSelect', async () => {
        const options = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' }
        ];
        const tabWrapper = mount(MultiSelect, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: {
                modelValue: [options[0]],
                options,
                optionLabel: 'name',
                autoOptionFocus: true
            }
        });

        expect(tabWrapper.vm.overlayVisible).toBe(false);
        expect(tabWrapper.vm.focusedOptionIndex).toBe(0);

        await tabWrapper.find('input[role="combobox"]').trigger('keydown', { code: 'Tab', key: 'Tab' });

        expect(tabWrapper.emitted('update:modelValue')).toBeUndefined();
        expect(tabWrapper.vm.overlayVisible).toBe(false);

        tabWrapper.unmount();
    });

    it('should chip work', async () => {
        await wrapper.setProps({
            display: 'chip',
            modelValue: [wrapper.vm.options[0]]
        });

        expect(wrapper.find('.p-chip.p-multiselect-chip').exists()).toBe(true);
        expect(wrapper.find('.p-chip.p-multiselect-chip > .p-chip-label').text()).toBe('New York');
    });

    describe('nested overlays', () => {
        let overlay;
        let owner;
        let nestedOverlay;

        beforeEach(async () => {
            vi.useFakeTimers();
            await wrapper.vm.$refs.container.click();
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

    describe('custom icons', () => {
        it('should have custom chip remove icon', async () => {
            await wrapper.setProps({
                display: 'chip',
                modelValue: [wrapper.vm.options[0]],
                removeTokenIcon: 'pi pi-discord'
            });

            const icon = wrapper.find('.p-chip-remove-icon');

            expect(icon.classes()).toContain('pi-discord');
        });

        it('should have custom dropdown icon', async () => {
            await wrapper.setProps({
                dropdownIcon: 'pi pi-discord'
            });

            const icon = wrapper.find('.p-multiselect-dropdown [data-pc-section="dropdownicon"]');

            expect(icon.classes()).toContain('pi-discord');
        });

        it('should have custom filter icon', async () => {
            await wrapper.setProps({
                filter: true,
                filterIcon: 'pi pi-discord'
            });

            await wrapper.vm.$refs.container.click();

            const icon = wrapper.find('.p-multiselect-filter-container [data-pc-section="filtericon"]');

            expect(icon.classes()).toContain('pi-discord');
        });

        it('should have custom checkbox icons', async () => {
            await wrapper.setProps({
                checkboxIcon: 'pi pi-discord'
            });

            await wrapper.setProps({
                checkboxIcon: 'pi pi-discord',
                modelValue: wrapper.vm.options
            });

            await wrapper.vm.$refs.container.click();

            wrapper.findAll('.p-checkbox-icon').forEach((icon) => {
                expect(icon.classes()).toContain('pi-discord');
            });
        });
    });

    const groupedItems = [
        {
            name: 'Germany',
            code: 'DE',
            items: [
                { name: 'Berlin', value: 'Berlin' },
                { name: 'Frankfurt', value: 'Frankfurt' },
                { name: 'Hamburg', value: 'Hamburg' },
                { name: 'Munich', value: 'Munich' }
            ]
        },
        {
            name: 'USA',
            code: 'US',
            items: [
                { name: 'Chicago', value: 'Chicago' },
                { name: 'Los Angeles', value: 'Los Angeles' },
                { name: 'New York', value: 'New York' },
                { name: 'San Francisco', value: 'San Francisco' }
            ]
        },
        {
            name: 'Japan',
            code: 'JP',
            items: [
                { name: 'Kyoto', value: 'Kyoto' },
                { name: 'Osaka', value: 'Osaka' },
                { name: 'Tokyo', value: 'Tokyo' },
                { name: 'Yokohama', value: 'Yokohama' }
            ]
        }
    ];

    describe('grouped', () => {
        it('should show group labels', async () => {
            await wrapper.setProps({
                options: groupedItems,
                optionGroupLabel: 'name',
                optionGroupChildren: 'items'
            });

            await wrapper.vm.$refs.container.click();
            expect(wrapper.find('.p-multiselect-option-group').exists()).toBe(true);
        });

        it('should show emit the filter event when filter text is entered', async () => {
            await wrapper.setProps({
                options: groupedItems,
                optionGroupLabel: 'name',
                optionGroupChildren: 'items',
                filter: true,
                autoFilterFocus: true
            });

            await wrapper.vm.$refs.container.click();
            const input = await wrapper.find('input.p-multiselect-filter');

            input.setValue('Ber');
            input.trigger('input');

            expect(wrapper.emitted()).toHaveProperty('filter');
        });

        it('should show relevant group labels for filtered items', async () => {
            await wrapper.setProps({
                options: groupedItems,
                optionGroupLabel: 'name',
                optionGroupChildren: 'items',
                filter: true,
                autoFilterFocus: true
            });

            await wrapper.vm.$refs.container.click();
            const input = await wrapper.find('input.p-multiselect-filter');

            input.value = 'Ber';

            await wrapper.vm.onFilterChange({ target: input });
            expect(wrapper.findAll('.p-multiselect-list').length).toBe(1);
            expect(wrapper.find('.p-multiselect-option-group').text()).toBe('Germany');
        });
    });

    describe('option group validation', () => {
        it('should handle optionGroupLabel set with non-grouped data correctly', async () => {
            const simpleOptions = [
                { name: 'New York', code: 'NY' },
                { name: 'Rome', code: 'RM' },
                { name: 'London', code: 'LDN' }
            ];

            await wrapper.setProps({
                options: simpleOptions,
                optionGroupLabel: 'name',
                optionGroupChildren: 'items'
            });

            const visibleOptions = wrapper.vm.visibleOptions;

            expect(visibleOptions.length).toBe(3);

            expect(wrapper.vm.isOptionGroup(simpleOptions[0])).toBe(false);
            expect(wrapper.vm.isOptionGroup(simpleOptions[1])).toBe(false);
            expect(wrapper.vm.isOptionGroup(simpleOptions[2])).toBe(false);

            await wrapper.vm.$refs.container.click();

            expect(wrapper.findAll('.p-multiselect-option').length).toBe(3);
            expect(wrapper.find('.p-multiselect-option-group').exists()).toBe(false);
        });

        it('should handle empty group data correctly', async () => {
            const optionsWithEmptyGroups = [{ name: 'Group 1', items: [] }, { name: 'Group 2', items: null }, { name: 'Group 3' }];

            await wrapper.setProps({
                options: optionsWithEmptyGroups,
                optionGroupLabel: 'name',
                optionGroupChildren: 'items',
                optionLabel: 'name'
            });

            const visibleOptions = wrapper.vm.visibleOptions;
            const groupHeaders = visibleOptions.filter((opt) => opt.group === true);

            expect(groupHeaders.length).toBe(1);
            expect(groupHeaders[0].optionGroup).toEqual(optionsWithEmptyGroups[0]);
        });

        it('should correctly identify actual group data', async () => {
            const actualGroupedData = [
                {
                    name: 'USA',
                    items: [
                        { name: 'New York', value: 'NY' },
                        { name: 'California', value: 'CA' }
                    ]
                },
                {
                    name: 'Europe',
                    items: [
                        { name: 'London', value: 'LON' },
                        { name: 'Paris', value: 'PAR' }
                    ]
                }
            ];

            await wrapper.setProps({
                options: actualGroupedData,
                optionGroupLabel: 'name',
                optionGroupChildren: 'items',
                optionLabel: 'name'
            });

            const visibleOptions = wrapper.vm.visibleOptions;
            const groupOptions = visibleOptions.filter((opt) => opt.group === true);

            groupOptions.forEach((groupOpt) => {
                expect(wrapper.vm.isOptionGroup(groupOpt)).toBe(true);
            });

            await wrapper.vm.$refs.container.click();

            expect(wrapper.findAll('.p-multiselect-option-group').length).toBe(2);
        });

        it('should not treat options as groups when optionGroupLabel is not set', async () => {
            const optionsWithGroupStructure = [
                {
                    name: 'Has Items Property',
                    items: [
                        { name: 'Child 1', value: 'c1' },
                        { name: 'Child 2', value: 'c2' }
                    ]
                }
            ];

            await wrapper.setProps({
                options: optionsWithGroupStructure,
                optionLabel: 'name'
            });

            const visibleOptions = wrapper.vm.visibleOptions;

            expect(visibleOptions).toEqual(optionsWithGroupStructure);

            expect(wrapper.vm.isOptionGroup(optionsWithGroupStructure[0])).toBe(false);
        });

        it('should reproduce the original bug scenario', async () => {
            const simpleOptions = [
                { name: 'Option 1', value: 'option1' },
                { name: 'Option 2', value: 'option2' },
                { name: 'Option 3', value: 'option3' }
            ];

            await wrapper.setProps({
                options: simpleOptions,
                optionLabel: 'name',
                optionValue: 'value',
                optionGroupLabel: 'category',
                optionGroupChildren: 'items'
            });

            await wrapper.vm.$refs.container.click();

            const checkboxes = wrapper.findAll('.p-checkbox');

            expect(checkboxes.length).toBe(4);

            const clickableOptions = wrapper.findAll('.p-multiselect-option');

            expect(clickableOptions.length).toBe(3);

            expect(wrapper.find('.p-multiselect-option-group').exists()).toBe(false);
        });

        it('should handle mixed data (groups and regular options) correctly', async () => {
            const mixedOptions = [
                { name: 'Regular Option 1', value: 'reg1' },
                {
                    name: 'Group 1',
                    items: [
                        { name: 'Group 1 Option 1', value: 'g1o1' },
                        { name: 'Group 1 Option 2', value: 'g1o2' }
                    ]
                },
                { name: 'Regular Option 2', value: 'reg2' },
                {
                    name: 'Group 2',
                    items: [{ name: 'Group 2 Option 1', value: 'g2o1' }]
                },
                { name: 'Regular Option 3', value: 'reg3' }
            ];

            await wrapper.setProps({
                options: mixedOptions,
                optionGroupLabel: 'name',
                optionGroupChildren: 'items',
                optionLabel: 'name',
                optionValue: 'value'
            });

            const visibleOptions = wrapper.vm.visibleOptions;

            expect(visibleOptions.length).toBe(8);

            const groupHeaders = visibleOptions.filter((opt) => opt.group === true);
            const regularOptions = visibleOptions.filter((opt) => !opt.group);

            expect(groupHeaders.length).toBe(2);
            expect(regularOptions.length).toBe(6);

            await wrapper.vm.$refs.container.click();

            expect(wrapper.findAll('.p-multiselect-option-group').length).toBe(2);
            expect(wrapper.findAll('.p-multiselect-option').length).toBe(6);
        });

        it('should handle mixed data with empty groups correctly', async () => {
            const mixedOptionsWithEmpty = [
                { name: 'Regular Option', value: 'reg1' },
                { name: 'Empty Group 1', items: [] },
                {
                    name: 'Valid Group',
                    items: [{ name: 'Group Option', value: 'gopt1' }]
                },
                { name: 'Not A Group', items: null },
                { name: 'Another Regular', value: 'reg2' }
            ];

            await wrapper.setProps({
                options: mixedOptionsWithEmpty,
                optionGroupLabel: 'name',
                optionGroupChildren: 'items',
                optionLabel: 'name',
                optionValue: 'value'
            });

            const visibleOptions = wrapper.vm.visibleOptions;

            expect(visibleOptions.length).toBe(6);

            const groupHeaders = visibleOptions.filter((opt) => opt.group === true);

            expect(groupHeaders.length).toBe(2);

            await wrapper.vm.$refs.container.click();

            expect(wrapper.findAll('.p-multiselect-option-group').length).toBe(2);
            expect(wrapper.findAll('.p-multiselect-option').length).toBe(4);
        });
    });

    describe('selection', () => {
        it('should match primitive values from optionValue', async () => {
            const wrapper = mountMultiSelect({ optionValue: 'code', modelValue: ['RM', 'PRS'] });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
            expect(selectedLabel(wrapper)).toBe('Rome, Paris');
        });

        it('should not compare each option against every selected value while rendering', async () => {
            // Guards #64: the rows, the select-all checkbox and the focused option on open each scanned the whole selection.
            const wrapper = mountMultiSelect({ optionValue: 'code', modelValue: ['RM'] });
            const isEquals = vi.spyOn(wrapper.vm, 'isEquals');

            await openOverlay(wrapper);
            await wrapper.setProps({ modelValue: ['RM', 'PRS'] });

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
            expect(wrapper.vm.findSelectedOptionIndex()).toBe(4);

            await headerCheckbox(wrapper).trigger('change');
            await wrapper.setProps({ modelValue: lastEmittedValue(wrapper) });

            expect(selectedLabels(wrapper)).toEqual(['New York', 'Rome', 'London', 'Istanbul', 'Paris']);
            expect(headerCheckbox(wrapper).element.checked).toBe(true);
            expect(isEquals).not.toHaveBeenCalled();
        });

        it('should not scan the options for each selected value to build the label', async () => {
            // Guards #64: the label looked up each selected value with a scan over all options.
            let reads = 0;
            const options = Array.from({ length: 200 }, (_, i) => {
                const option = { name: `Item #${i}` };

                Object.defineProperty(option, 'code', {
                    enumerable: true,
                    get() {
                        reads++;

                        return i;
                    }
                });

                return option;
            });
            const codes = options.map((_, i) => i);
            const wrapper = mountMultiSelect({ options, optionValue: 'code', maxSelectedLabels: 3, modelValue: codes.slice(0, 100) });

            expect(selectedLabel(wrapper)).toBe('100 items selected');

            reads = 0;
            await wrapper.setProps({ modelValue: [...codes].reverse() });

            expect(selectedLabel(wrapper)).toBe('200 items selected');
            expect(reads).toBeLessThanOrEqual(options.length);

            await wrapper.setProps({ maxSelectedLabels: null, modelValue: [5, 7] });

            expect(selectedLabel(wrapper)).toBe('Item #5, Item #7');
        });

        it('should match option objects by reference', async () => {
            const options = cities();
            const wrapper = mountMultiSelect({ options, modelValue: [options[1], options[4]] });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
            expect(selectedLabel(wrapper)).toBe('Rome, Paris');
        });

        it('should match equal copies of option objects by deep equality', async () => {
            const options = cities();
            const wrapper = mountMultiSelect({ options, modelValue: [{ ...options[1] }, { ...options[4] }] });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
            expect(selectedLabel(wrapper)).toBe('Rome, Paris');
        });

        it('should not match a copy that differs in any field without dataKey', async () => {
            const wrapper = mountMultiSelect({ modelValue: [{ name: 'Rome (copy)', code: 'RM' }] });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual([]);
            expect(selectedLabel(wrapper)).toBe('Select Cities');
        });

        it('should match option objects by dataKey only', async () => {
            const wrapper = mountMultiSelect({ dataKey: 'code', modelValue: [{ name: 'Rome (copy)', code: 'RM' }, { code: 'PRS' }] });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
            // The label comes from the matched option, not from the selected copy.
            expect(selectedLabel(wrapper)).toBe('Rome, Paris');
        });

        it('should keep disabled options shown as selected', async () => {
            const options = cities();

            options[1].disabled = true;

            const wrapper = mountMultiSelect({ options, optionValue: 'code', optionDisabled: 'disabled', modelValue: ['NY', 'RM'] });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['New York', 'Rome']);
            expect(selectedLabel(wrapper)).toBe('New York, Rome');
        });

        it('should disable the unselected options once the selection limit is reached', async () => {
            const wrapper = mountMultiSelect({ optionValue: 'code', selectionLimit: 2, modelValue: ['RM', 'PRS'] });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
            expect(wrapper.findAll('li.p-multiselect-option').map((option) => option.attributes('aria-disabled'))).toEqual(['true', 'false', 'true', 'true', 'false']);
        });

        it('should match options inside groups', async () => {
            const wrapper = mountMultiSelect({
                options: groupedCities(),
                optionLabel: 'label',
                optionValue: 'value',
                optionGroupLabel: 'label',
                optionGroupChildren: 'items',
                modelValue: ['Frankfurt', 'Chicago']
            });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['Frankfurt', 'Chicago']);
            expect(selectedLabel(wrapper)).toBe('Frankfurt, Chicago');
        });

        it('should update when modelValue is replaced', async () => {
            const wrapper = mountMultiSelect({ optionValue: 'code', modelValue: ['RM'] });

            await openOverlay(wrapper);
            await wrapper.setProps({ modelValue: ['LDN', 'IST'] });

            expect(selectedLabels(wrapper)).toEqual(['London', 'Istanbul']);
            expect(selectedLabel(wrapper)).toBe('London, Istanbul');
        });

        it('should update when the modelValue array is changed in place', async () => {
            const modelValue = reactive(['RM']);
            const wrapper = mountMultiSelect({ optionValue: 'code', modelValue });

            await openOverlay(wrapper);

            modelValue.push('PRS');
            await nextTick();
            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
            expect(selectedLabel(wrapper)).toBe('Rome, Paris');

            // Same length, different content: catches lookups that only watch the array length.
            modelValue[0] = 'LDN';
            await nextTick();
            expect(selectedLabels(wrapper)).toEqual(['London', 'Paris']);
            expect(selectedLabel(wrapper)).toBe('London, Paris');

            modelValue.splice(1, 1);
            await nextTick();
            expect(selectedLabels(wrapper)).toEqual(['London']);
            expect(selectedLabel(wrapper)).toBe('London');
        });

        it('should update the label when the options change', async () => {
            const wrapper = mountMultiSelect({ optionValue: 'code', modelValue: ['RM', 'XX'] });

            expect(selectedLabel(wrapper)).toBe('Rome');

            await wrapper.setProps({ options: [...cities(), { name: 'Unknown', code: 'XX' }] });

            expect(selectedLabel(wrapper)).toBe('Rome, Unknown');
        });

        it('should update the label when the options array is changed in place', async () => {
            const options = reactive(cities());
            const wrapper = mountMultiSelect({ options, optionValue: 'code', modelValue: ['RM', 'XX'] });

            expect(selectedLabel(wrapper)).toBe('Rome');

            options.push({ name: 'Unknown', code: 'XX' });
            await nextTick();
            expect(selectedLabel(wrapper)).toBe('Rome, Unknown');

            // Rome now has the code XX, comes first and wins; RM matches no option any more.
            options[1].code = 'XX';
            await nextTick();
            expect(selectedLabel(wrapper)).toBe('Rome');
        });

        it('should remove a selected option and add an unselected one on click', async () => {
            const wrapper = mountMultiSelect({ optionValue: 'code', modelValue: ['RM', 'PRS'] });

            await openOverlay(wrapper);

            await wrapper.findAll('li.p-multiselect-option')[1].trigger('click');
            expect(lastEmittedValue(wrapper)).toEqual(['PRS']);

            await wrapper.setProps({ modelValue: ['PRS'] });
            await wrapper.findAll('li.p-multiselect-option')[2].trigger('click');
            expect(lastEmittedValue(wrapper)).toEqual(['PRS', 'LDN']);
        });

        it('should remove an equal copy on click without dataKey', async () => {
            const options = cities();
            const wrapper = mountMultiSelect({ options, modelValue: [{ ...options[1] }, { ...options[4] }] });

            await openOverlay(wrapper);
            await wrapper.findAll('li.p-multiselect-option')[1].trigger('click');

            expect(lastEmittedValue(wrapper)).toEqual([options[4]]);
        });

        it('should show chips for equal copies and dataKey matches and remove them', async () => {
            const options = cities();
            const wrapper = mountMultiSelect({ options, display: 'chip', modelValue: [{ ...options[1] }, { ...options[4] }] });
            const chipLabels = () => wrapper.findAll('.p-multiselect-chip-item .p-chip-label').map((chip) => chip.text());

            expect(chipLabels()).toEqual(['Rome', 'Paris']);

            await wrapper.setProps({ dataKey: 'code', modelValue: [{ code: 'RM' }, { name: 'Paris (copy)', code: 'PRS' }, { code: 'XX' }] });

            expect(chipLabels()).toEqual(['Rome', 'Paris']);

            await wrapper.findAll('.p-multiselect-chip-item .p-chip-remove-icon')[0].trigger('click');

            expect(lastEmittedValue(wrapper)).toEqual([{ name: 'Paris (copy)', code: 'PRS' }, { code: 'XX' }]);
        });

        it('should render the selection correctly with the virtual scroller', async () => {
            const options = Array.from({ length: 1000 }, (_, i) => ({ name: `Item #${i}`, value: i }));
            const modelValue = options.filter((option) => option.value % 2 === 0).map((option) => option.value);
            const wrapper = mountMultiSelect({ options, optionValue: 'value', modelValue, virtualScrollerOptions: { itemSize: 44 } });

            await openOverlay(wrapper);

            // jsdom has no layout, so the scroller can't work out its viewport. Set the rendered range by hand,
            // far down the list, as if the user had scrolled there.
            const scroller = wrapper.vm.virtualScroller;

            scroller.first = 900;
            scroller.last = 920;
            await nextTick();

            const rendered = wrapper.findAll('li.p-multiselect-option');

            expect(rendered.map((option) => option.attributes('aria-label'))).toEqual(Array.from({ length: 20 }, (_, i) => `Item #${900 + i}`));
            rendered.forEach((option) => {
                const index = Number(option.attributes('aria-posinset')) - 1;
                const selected = String(index % 2 === 0);

                expect(option.attributes('aria-selected')).toBe(selected);
                expect(option.attributes('data-p-selected')).toBe(selected);
                expect(String(option.find('input[type="checkbox"]').element.checked)).toBe(selected);
            });
            expect(headerCheckbox(wrapper).element.checked).toBe(false);
        });
    });

    describe('select all', () => {
        it('should select every option and deselect all again', async () => {
            const wrapper = mountMultiSelect({ optionValue: 'code', modelValue: [] });

            await openOverlay(wrapper);
            expect(headerCheckbox(wrapper).element.checked).toBe(false);

            await headerCheckbox(wrapper).trigger('change');
            expect(lastEmittedValue(wrapper)).toEqual(['NY', 'RM', 'LDN', 'IST', 'PRS']);

            await wrapper.setProps({ modelValue: lastEmittedValue(wrapper) });
            expect(headerCheckbox(wrapper).element.checked).toBe(true);
            expect(selectedLabels(wrapper)).toEqual(['New York', 'Rome', 'London', 'Istanbul', 'Paris']);
            expect(selectedLabel(wrapper)).toBe('New York, Rome, London, Istanbul, Paris');

            await headerCheckbox(wrapper).trigger('change');
            expect(lastEmittedValue(wrapper)).toEqual([]);
        });

        it('should select option objects by reference', async () => {
            const options = cities();
            const wrapper = mountMultiSelect({ options, modelValue: [] });

            await openOverlay(wrapper);
            await headerCheckbox(wrapper).trigger('change');

            const value = lastEmittedValue(wrapper);

            expect(value).toEqual(options);
            // The test mount makes the props reactive, so compare the original objects behind the proxies.
            value.forEach((selected, index) => expect(toRaw(selected)).toBe(options[index]));
        });

        it('should show all selected for equal copies and dataKey matches', async () => {
            const options = cities();
            const wrapper = mountMultiSelect({ options, modelValue: options.map((option) => ({ ...option })) });

            await openOverlay(wrapper);
            expect(headerCheckbox(wrapper).element.checked).toBe(true);

            await wrapper.setProps({ dataKey: 'code', modelValue: options.map((option) => ({ code: option.code })) });
            expect(headerCheckbox(wrapper).element.checked).toBe(true);

            await wrapper.setProps({ modelValue: options.slice(1).map((option) => ({ code: option.code })) });
            expect(headerCheckbox(wrapper).element.checked).toBe(false);
        });

        it('should ignore disabled options', async () => {
            const options = cities();

            options[1].disabled = true;

            const wrapper = mountMultiSelect({ options, optionValue: 'code', optionDisabled: 'disabled', modelValue: [] });

            await openOverlay(wrapper);
            await headerCheckbox(wrapper).trigger('change');
            expect(lastEmittedValue(wrapper)).toEqual(['NY', 'LDN', 'IST', 'PRS']);

            await wrapper.setProps({ modelValue: lastEmittedValue(wrapper) });
            expect(headerCheckbox(wrapper).element.checked).toBe(true);
        });

        it('should only consider the filtered options', async () => {
            const wrapper = mountMultiSelect({ optionValue: 'code', filter: true, modelValue: ['RM', 'PRS'] });

            await openOverlay(wrapper);
            await wrapper.find('input.p-multiselect-filter').setValue('o');

            expect(renderedLabels(wrapper)).toEqual(['New York', 'Rome', 'London']);
            expect(selectedLabels(wrapper)).toEqual(['Rome']);
            expect(headerCheckbox(wrapper).element.checked).toBe(false);

            await headerCheckbox(wrapper).trigger('change');
            expect(lastEmittedValue(wrapper)).toEqual(['NY', 'RM', 'LDN']);

            await wrapper.setProps({ modelValue: ['NY', 'RM', 'LDN'] });
            expect(headerCheckbox(wrapper).element.checked).toBe(true);
        });

        it('should skip group headers', async () => {
            const options = groupedCities();
            const wrapper = mountMultiSelect({
                options,
                optionLabel: 'label',
                optionValue: 'value',
                optionGroupLabel: 'label',
                optionGroupChildren: 'items',
                modelValue: []
            });
            const values = options.flatMap((group) => group.items.map((item) => item.value));

            await openOverlay(wrapper);
            await headerCheckbox(wrapper).trigger('change');
            expect(lastEmittedValue(wrapper)).toEqual(values);

            await wrapper.setProps({ modelValue: values });
            expect(headerCheckbox(wrapper).element.checked).toBe(true);
        });

        it('should select every option with Ctrl+A', async () => {
            const wrapper = mountMultiSelect({ optionValue: 'code', modelValue: ['RM'] });

            await wrapper.find('input[role="combobox"]').trigger('keydown', { code: 'KeyA', ctrlKey: true });

            expect(lastEmittedValue(wrapper)).toEqual(['NY', 'RM', 'LDN', 'IST', 'PRS']);
        });
    });

    describe('overridden isEquals', () => {
        // A component that extends MultiSelect with its own equality rule, here case-insensitive codes.
        const CaseInsensitiveMultiSelect = {
            extends: MultiSelect,
            render: MultiSelect.render,
            methods: {
                isEquals(value1, value2) {
                    return String(value1).toLowerCase() === String(value2).toLowerCase();
                }
            }
        };

        const mountCaseInsensitive = (props) => mountMultiSelect({ optionValue: 'code', ...props }, CaseInsensitiveMultiSelect);

        it('should use the overridden isEquals to show selected options', async () => {
            const wrapper = mountCaseInsensitive({ modelValue: ['rm', 'prs'] });

            await openOverlay(wrapper);

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
        });

        it('should use the overridden isEquals for the select-all checkbox', async () => {
            const wrapper = mountCaseInsensitive({ modelValue: ['ny', 'rm', 'ldn', 'ist', 'prs'] });

            await openOverlay(wrapper);

            expect(headerCheckbox(wrapper).element.checked).toBe(true);
        });

        it('should use the overridden isEquals in findSelectedOptionIndex', () => {
            const wrapper = mountCaseInsensitive({ modelValue: ['ny', 'prs'] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(4);
        });
    });

    describe('selected option index', () => {
        it('should return -1 from findSelectedOptionIndex when nothing is selected', () => {
            const wrapper = mountMultiSelect({ optionValue: 'code', modelValue: [] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(-1);
        });

        it('should return the most recently selected option from findSelectedOptionIndex', async () => {
            const wrapper = mountMultiSelect({ optionValue: 'code', modelValue: ['NY', 'PRS'] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(4);

            await wrapper.setProps({ modelValue: ['PRS', 'NY'] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(0);
        });

        it('should find equal copies in findSelectedOptionIndex without dataKey', () => {
            const options = cities();
            const wrapper = mountMultiSelect({ options, modelValue: [{ ...options[1] }, { ...options[3] }] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(3);
        });

        it('should find dataKey matches in findSelectedOptionIndex', () => {
            const wrapper = mountMultiSelect({ dataKey: 'code', modelValue: [{ code: 'IST' }, { code: 'RM' }] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(1);
        });

        it('should skip selected values that match no option in findSelectedOptionIndex', () => {
            const wrapper = mountMultiSelect({ dataKey: 'code', modelValue: [{ code: 'RM' }, { code: 'XX' }] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(1);
        });

        it('should return the first of several options with the same value from findSelectedOptionIndex', () => {
            const options = [...cities(), { name: 'Rome (again)', code: 'RM' }];
            const wrapper = mountMultiSelect({ options, optionValue: 'code', modelValue: ['RM'] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(1);
        });

        it('should keep the selection order when references and equal copies are mixed in findSelectedOptionIndex', async () => {
            const options = cities();
            const wrapper = mountMultiSelect({ options, modelValue: [options[1], { ...options[3] }] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(3);

            await wrapper.setProps({ modelValue: [{ ...options[3] }, options[1]] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(1);
        });

        it('should skip disabled options in findSelectedOptionIndex', () => {
            const options = cities();

            options[1].disabled = true;

            const wrapper = mountMultiSelect({ options, optionValue: 'code', optionDisabled: 'disabled', modelValue: ['NY', 'RM'] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(0);
        });

        it('should skip filtered-out values in findSelectedOptionIndex', async () => {
            const wrapper = mountMultiSelect({ optionValue: 'code', filter: true, modelValue: ['RM', 'PRS'] });

            await openOverlay(wrapper);
            await wrapper.find('input.p-multiselect-filter').setValue('o');

            expect(renderedLabels(wrapper)).toEqual(['New York', 'Rome', 'London']);
            expect(wrapper.vm.findSelectedOptionIndex()).toBe(1);
        });

        it('should count group headers in the indexes', () => {
            // Visible options: [Germany, Berlin, Frankfurt, Hamburg, Munich, USA, Chicago, ...]
            const wrapper = mountMultiSelect({
                options: groupedCities(),
                optionLabel: 'label',
                optionValue: 'value',
                optionGroupLabel: 'label',
                optionGroupChildren: 'items',
                modelValue: ['Chicago', 'Frankfurt']
            });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(2);
            expect(wrapper.vm.findFirstSelectedOptionIndex()).toBe(2);
            expect(wrapper.vm.findLastSelectedOptionIndex()).toBe(6);
        });

        it('should find the first and last selected options in option order', () => {
            const wrapper = mountMultiSelect({ optionValue: 'code', modelValue: ['IST', 'RM'] });

            expect(wrapper.vm.findFirstSelectedOptionIndex()).toBe(1);
            expect(wrapper.vm.findLastSelectedOptionIndex()).toBe(3);
            expect(wrapper.vm.findFirstFocusedOptionIndex()).toBe(1);
            expect(wrapper.vm.findLastFocusedOptionIndex()).toBe(1);
        });

        it('should find the next and previous selected options', () => {
            const wrapper = mountMultiSelect({ optionValue: 'code', modelValue: ['NY', 'IST'] });

            expect(wrapper.vm.findNextSelectedOptionIndex(1)).toBe(3);
            expect(wrapper.vm.findNextSelectedOptionIndex(3)).toBe(-1);
            expect(wrapper.vm.findPrevSelectedOptionIndex(3)).toBe(0);
            expect(wrapper.vm.findPrevSelectedOptionIndex(0)).toBe(-1);
        });

        it('should focus the most recently selected option on open by default', async () => {
            const wrapper = mountMultiSelect({ optionValue: 'code', modelValue: ['RM', 'PRS'] });

            await openOverlay(wrapper);

            expect(wrapper.vm.focusedOptionIndex).toBe(4);
        });

        it('should focus the first selected option on open with autoOptionFocus', async () => {
            const wrapper = mountMultiSelect({ optionValue: 'code', modelValue: ['PRS', 'RM'], autoOptionFocus: true });

            wrapper.vm.focusedOptionIndex = -1;
            await openOverlay(wrapper);

            expect(wrapper.vm.focusedOptionIndex).toBe(1);
        });

        it('should select a range up to the nearest selected option', () => {
            const wrapper = mountMultiSelect({ optionValue: 'code', modelValue: ['RM'] });

            wrapper.vm.onOptionSelectRange({}, -1, 3);
            expect(lastEmittedValue(wrapper)).toEqual(['RM', 'LDN', 'IST']);
        });

        it('should select a range down to the nearest selected option', () => {
            const wrapper = mountMultiSelect({ optionValue: 'code', modelValue: ['IST'] });

            wrapper.vm.onOptionSelectRange({}, 0, -1);
            expect(lastEmittedValue(wrapper)).toEqual(['NY', 'RM', 'LDN', 'IST']);
        });

        it('should select a range of equal copies and dataKey matches', async () => {
            const options = cities();
            const wrapper = mountMultiSelect({ options, modelValue: [{ ...options[3] }] });

            wrapper.vm.onOptionSelectRange({}, 1, -1);
            expect(lastEmittedValue(wrapper)).toEqual(options.slice(1, 4));

            await wrapper.setProps({ dataKey: 'code', modelValue: [{ code: 'NY' }] });

            wrapper.vm.onOptionSelectRange({}, -1, 2);
            expect(lastEmittedValue(wrapper)).toEqual(options.slice(0, 3));
        });
    });
});
