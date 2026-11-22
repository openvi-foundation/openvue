import { mount } from '@vue/test-utils';
import { nextTick, reactive } from 'vue';
import Listbox from './Listbox.vue';

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

const mountListbox = (props = {}) => mount(Listbox, { props: { options: cities(), optionLabel: 'name', ...props } });

const selectedLabels = (wrapper) =>
    wrapper
        .findAll('li.p-listbox-option')
        .filter((option) => option.attributes('aria-selected') === 'true')
        .map((option) => option.attributes('aria-label'));

const lastEmittedValue = (wrapper) => wrapper.emitted('update:modelValue').at(-1)[0];

describe('Listbox.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(Listbox, {
            props: {
                modelValue: null,
                options: [
                    { name: 'New York', code: 'NY' },
                    { name: 'Rome', code: 'RM' },
                    { name: 'London', code: 'LDN' },
                    { name: 'Istanbul', code: 'IST' },
                    { name: 'Paris', code: 'PRS' }
                ],
                optionLabel: 'name'
            }
        });
    });

    it('should exist', () => {
        expect(wrapper.find('.p-listbox.p-component').exists()).toBe(true);
        expect(wrapper.findAll('li.p-listbox-option').length).toBe(5);
        expect(wrapper.findAll('li.p-listbox-option')[0].attributes()['aria-label']).toBe('New York');
    });

    it('should select a list item', async () => {
        await wrapper.vm.onOptionSelect({}, wrapper.vm.options[0]);

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([wrapper.vm.options[0]]);

        await wrapper.setProps({ modelValue: wrapper.vm.options[0] });

        expect(wrapper.findAll('li.p-listbox-option')[0].classes()).toContain('p-listbox-option-selected');
    });

    describe('filter', () => {
        it('should have correct custom icon', async () => {
            await wrapper.setProps({
                filter: true,
                filterIcon: 'pi pi-discord'
            });

            const icon = wrapper.find('.p-inputicon [data-pc-section="filtericon"]');

            expect(icon.classes()).toContain('pi-discord');
        });

        it('should correctly filter', async () => {
            await wrapper.setProps({
                filter: true
            });

            const filterInput = wrapper.find('input.p-listbox-filter');

            expect(filterInput.exists()).toBe(true);

            await filterInput.setValue('is');

            const options = wrapper.findAll('.p-listbox-option');

            expect(options.length).toBe(2);
            expect(options[0].text()).toBe('Istanbul');
        });

        it('should correctly filter groups', async () => {
            await wrapper.setProps({
                filter: true,
                optionGroupLabel: 'label',
                optionLabel: 'label',
                optionGroupChildren: 'items',
                options: [
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
                ]
            });

            const filterInput = wrapper.find('input.p-listbox-filter');

            expect(filterInput.exists()).toBe(true);

            await filterInput.setValue('ch');

            const optionGroups = wrapper.findAll('.p-listbox-option-group');
            const options = wrapper.findAll('.p-listbox-option');

            expect(optionGroups.length).toBe(2);
            expect(optionGroups[0].text()).toBe('Germany');
            expect(optionGroups[1].text()).toBe('USA');

            expect(options.length).toBe(2);
            expect(options[0].text()).toBe('Munich');
            expect(options[1].text()).toBe('Chicago');
        });
    });

    describe('multiple selection', () => {
        it('should match primitive values from optionValue', () => {
            const wrapper = mountListbox({ multiple: true, optionValue: 'code', modelValue: ['RM', 'PRS'] });

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
        });

        it('should not compare each option against every selected value while rendering', async () => {
            // Guards #560: a per-row scan of the selection made rendering slow with many selected options.
            const wrapper = mountListbox({ multiple: true, optionValue: 'code', modelValue: ['RM'] });
            const isEquals = vi.spyOn(wrapper.vm, 'isEquals');

            await wrapper.setProps({ modelValue: ['RM', 'PRS'] });

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
            expect(isEquals).not.toHaveBeenCalled();
        });

        it('should match option objects by reference', () => {
            const options = cities();
            const wrapper = mountListbox({ multiple: true, options, modelValue: [options[1], options[4]] });

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
        });

        it('should match equal copies of option objects by deep equality', () => {
            const options = cities();
            const wrapper = mountListbox({ multiple: true, options, modelValue: [{ ...options[1] }, { ...options[4] }] });

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
        });

        it('should not match a copy that differs in any field without dataKey', () => {
            const wrapper = mountListbox({ multiple: true, modelValue: [{ name: 'Rome (copy)', code: 'RM' }] });

            expect(selectedLabels(wrapper)).toEqual([]);
        });

        it('should match option objects by dataKey only', () => {
            const wrapper = mountListbox({ multiple: true, dataKey: 'code', modelValue: [{ name: 'Rome (copy)', code: 'RM' }, { code: 'PRS' }] });

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
        });

        it('should keep disabled options shown as selected', () => {
            const options = cities();

            options[1].disabled = true;

            const wrapper = mountListbox({ multiple: true, options, optionValue: 'code', optionDisabled: 'disabled', modelValue: ['NY', 'RM'] });

            expect(selectedLabels(wrapper)).toEqual(['New York', 'Rome']);
        });

        it('should match options inside groups', () => {
            const wrapper = mountListbox({
                multiple: true,
                options: groupedCities(),
                optionLabel: 'label',
                optionValue: 'value',
                optionGroupLabel: 'label',
                optionGroupChildren: 'items',
                modelValue: ['Frankfurt', 'Chicago']
            });

            expect(selectedLabels(wrapper)).toEqual(['Frankfurt', 'Chicago']);
        });

        it('should update when modelValue is replaced', async () => {
            const wrapper = mountListbox({ multiple: true, optionValue: 'code', modelValue: ['RM'] });

            await wrapper.setProps({ modelValue: ['LDN', 'IST'] });

            expect(selectedLabels(wrapper)).toEqual(['London', 'Istanbul']);
        });

        it('should update when the modelValue array is changed in place', async () => {
            const modelValue = reactive(['RM']);
            const wrapper = mountListbox({ multiple: true, optionValue: 'code', modelValue });

            modelValue.push('PRS');
            await nextTick();
            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);

            // Same length, different content: catches lookups that only watch the array length.
            modelValue[0] = 'LDN';
            await nextTick();
            expect(selectedLabels(wrapper)).toEqual(['London', 'Paris']);

            modelValue.splice(1, 1);
            await nextTick();
            expect(selectedLabels(wrapper)).toEqual(['London']);
        });

        it('should update when multiple is toggled', async () => {
            const wrapper = mountListbox({ optionValue: 'code', modelValue: 'RM' });

            expect(selectedLabels(wrapper)).toEqual(['Rome']);

            await wrapper.setProps({ multiple: true, modelValue: ['LDN'] });

            expect(selectedLabels(wrapper)).toEqual(['London']);
        });

        it('should remove a selected option and add an unselected one on click', async () => {
            const wrapper = mountListbox({ multiple: true, optionValue: 'code', modelValue: ['RM', 'PRS'] });

            await wrapper.findAll('li.p-listbox-option')[1].trigger('click');
            expect(lastEmittedValue(wrapper)).toEqual(['PRS']);

            await wrapper.setProps({ modelValue: ['PRS'] });
            await wrapper.findAll('li.p-listbox-option')[2].trigger('click');
            expect(lastEmittedValue(wrapper)).toEqual(['PRS', 'LDN']);
        });

        it('should remove an equal copy on click without dataKey', async () => {
            const options = cities();
            const wrapper = mountListbox({ multiple: true, options, modelValue: [{ ...options[1] }, { ...options[4] }] });

            await wrapper.findAll('li.p-listbox-option')[1].trigger('click');

            expect(lastEmittedValue(wrapper)).toEqual([options[4]]);
        });

        it('should render the selection correctly with the virtual scroller', async () => {
            const options = Array.from({ length: 1000 }, (_, i) => ({ name: `Item #${i}`, value: i }));
            const modelValue = options.filter((option) => option.value % 2 === 0).map((option) => option.value);
            const wrapper = mountListbox({ multiple: true, options, optionValue: 'value', modelValue, virtualScrollerOptions: { itemSize: 38 }, listStyle: 'height:250px' });

            // jsdom has no layout, so the scroller can't work out its viewport. Set the rendered range by hand,
            // far down the list, as if the user had scrolled there.
            const scroller = wrapper.vm.virtualScroller;

            scroller.first = 900;
            scroller.last = 920;
            await nextTick();

            const rendered = wrapper.findAll('li.p-listbox-option');

            expect(rendered.map((option) => option.attributes('aria-label'))).toEqual(Array.from({ length: 20 }, (_, i) => `Item #${900 + i}`));
            rendered.forEach((option) => {
                const index = Number(option.attributes('aria-posinset')) - 1;

                expect(option.attributes('aria-selected')).toBe(String(index % 2 === 0));
            });
        });
    });

    describe('overridden isEquals', () => {
        // A component that extends Listbox with its own equality rule, here case-insensitive codes.
        const CaseInsensitiveListbox = {
            extends: Listbox,
            render: Listbox.render,
            methods: {
                isEquals(value1, value2) {
                    return String(value1).toLowerCase() === String(value2).toLowerCase();
                }
            }
        };

        const mountCaseInsensitive = (props) => mount(CaseInsensitiveListbox, { props: { options: cities(), optionLabel: 'name', multiple: true, optionValue: 'code', ...props } });

        it('should use the overridden isEquals to show selected options', () => {
            const wrapper = mountCaseInsensitive({ modelValue: ['rm', 'prs'] });

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
        });

        it('should use the overridden isEquals in findSelectedOptionIndex', () => {
            const wrapper = mountCaseInsensitive({ modelValue: ['ny', 'prs'] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(4);
        });
    });

    describe('single selection', () => {
        it('should match a primitive value', () => {
            const wrapper = mountListbox({ optionValue: 'code', modelValue: 'RM' });

            expect(selectedLabels(wrapper)).toEqual(['Rome']);
        });

        it('should match an equal copy of an option object', () => {
            const options = cities();
            const wrapper = mountListbox({ options, modelValue: { ...options[1] } });

            expect(selectedLabels(wrapper)).toEqual(['Rome']);
        });
    });

    describe('selected option index', () => {
        it('should return -1 from findSelectedOptionIndex when nothing is selected', () => {
            const wrapper = mountListbox({ multiple: true, optionValue: 'code', modelValue: [] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(-1);
        });

        it('should return the most recently selected option from findSelectedOptionIndex', async () => {
            const wrapper = mountListbox({ multiple: true, optionValue: 'code', modelValue: ['NY', 'PRS'] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(4);

            await wrapper.setProps({ modelValue: ['PRS', 'NY'] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(0);
        });

        it('should find equal copies in findSelectedOptionIndex without dataKey', () => {
            const options = cities();
            const wrapper = mountListbox({ multiple: true, options, modelValue: [{ ...options[1] }, { ...options[3] }] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(3);
        });

        it('should find dataKey matches in findSelectedOptionIndex', () => {
            const wrapper = mountListbox({ multiple: true, dataKey: 'code', modelValue: [{ code: 'IST' }, { code: 'RM' }] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(1);
        });

        it('should skip selected values that match no option in findSelectedOptionIndex', () => {
            const wrapper = mountListbox({ multiple: true, dataKey: 'code', modelValue: [{ code: 'RM' }, { code: 'XX' }] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(1);
        });

        it('should return the first of several options with the same value from findSelectedOptionIndex', () => {
            const options = [...cities(), { name: 'Rome (again)', code: 'RM' }];
            const wrapper = mountListbox({ multiple: true, options, optionValue: 'code', modelValue: ['RM'] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(1);
        });

        it('should keep the selection order when references and equal copies are mixed in findSelectedOptionIndex', async () => {
            const options = cities();
            const wrapper = mountListbox({ multiple: true, options, modelValue: [options[1], { ...options[3] }] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(3);

            await wrapper.setProps({ modelValue: [{ ...options[3] }, options[1]] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(1);
        });

        it('should skip disabled options in findSelectedOptionIndex', () => {
            const options = cities();

            options[1].disabled = true;

            const wrapper = mountListbox({ multiple: true, options, optionValue: 'code', optionDisabled: 'disabled', modelValue: ['NY', 'RM'] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(0);
        });

        it('should skip filtered-out values in findSelectedOptionIndex', async () => {
            const wrapper = mountListbox({ multiple: true, optionValue: 'code', modelValue: ['RM', 'PRS'], filter: true });

            await wrapper.find('input.p-listbox-filter').setValue('o');

            expect(wrapper.findAll('li.p-listbox-option').map((option) => option.attributes('aria-label'))).toEqual(['New York', 'Rome', 'London']);
            expect(wrapper.vm.findSelectedOptionIndex()).toBe(1);
        });

        it('should count group headers in the indexes', () => {
            // Visible options: [Germany, Berlin, Frankfurt, Hamburg, Munich, USA, Chicago, ...]
            const wrapper = mountListbox({
                multiple: true,
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
            const wrapper = mountListbox({ multiple: true, optionValue: 'code', modelValue: ['IST', 'RM'] });

            expect(wrapper.vm.findFirstSelectedOptionIndex()).toBe(1);
            expect(wrapper.vm.findLastSelectedOptionIndex()).toBe(3);
            expect(wrapper.vm.findFirstFocusedOptionIndex()).toBe(1);
            expect(wrapper.vm.findLastFocusedOptionIndex()).toBe(3);
        });

        it('should find the next and previous selected options', () => {
            const wrapper = mountListbox({ multiple: true, optionValue: 'code', modelValue: ['NY', 'IST'] });

            expect(wrapper.vm.findNextSelectedOptionIndex(1)).toBe(3);
            expect(wrapper.vm.findNextSelectedOptionIndex(3)).toBe(-1);
            expect(wrapper.vm.findPrevSelectedOptionIndex(3)).toBe(0);
            expect(wrapper.vm.findPrevSelectedOptionIndex(0)).toBe(-1);
        });

        it('should focus the first selected option on focus by default', async () => {
            const wrapper = mountListbox({ multiple: true, optionValue: 'code', modelValue: ['PRS', 'RM'] });

            await wrapper.find('ul[role="listbox"]').trigger('focus');

            expect(wrapper.vm.focusedOptionIndex).toBe(1);
        });

        it('should focus the most recently selected option on focus without autoOptionFocus', async () => {
            const wrapper = mountListbox({ multiple: true, optionValue: 'code', modelValue: ['RM', 'PRS'], autoOptionFocus: false });

            await wrapper.find('ul[role="listbox"]').trigger('focus');

            expect(wrapper.vm.focusedOptionIndex).toBe(4);
        });

        it('should select a range up to the nearest selected option', () => {
            const wrapper = mountListbox({ multiple: true, optionValue: 'code', modelValue: ['RM'] });

            wrapper.vm.onOptionSelectRange({}, -1, 3);
            expect(lastEmittedValue(wrapper)).toEqual(['RM', 'LDN', 'IST']);
        });

        it('should select a range down to the nearest selected option', () => {
            const wrapper = mountListbox({ multiple: true, optionValue: 'code', modelValue: ['IST'] });

            wrapper.vm.onOptionSelectRange({}, 0, -1);
            expect(lastEmittedValue(wrapper)).toEqual(['NY', 'RM', 'LDN', 'IST']);
        });
    });

    describe('objects without dataKey', () => {
        const items = (count) => Array.from({ length: count }, (_, i) => ({ id: i, name: `Item #${i}` }));

        const mountItems = (props) => mount(Listbox, { props: { optionLabel: 'name', multiple: true, ...props } });

        it('should not compare unselected options with the whole selection while rendering', async () => {
            // Guards #730: without dataKey every unselected option was deep-compared with every selected object.
            const options = items(20);
            const wrapper = mountItems({ options, modelValue: [] });
            const isEquals = vi.spyOn(wrapper.vm, 'isEquals');

            await wrapper.setProps({ modelValue: options.filter((option) => option.id % 2 === 0) });

            expect(selectedLabels(wrapper)).toEqual(options.filter((option) => option.id % 2 === 0).map((option) => option.name));
            expect(isEquals).not.toHaveBeenCalled();
        });

        it('should only deep-compare an equal copy with the options it can be equal to', async () => {
            const options = items(20);
            const wrapper = mountItems({ options, modelValue: [] });
            const isEquals = vi.spyOn(wrapper.vm, 'isEquals');

            await wrapper.setProps({ modelValue: [{ ...options[3] }, { ...options[7] }] });

            expect(selectedLabels(wrapper)).toEqual(['Item #3', 'Item #7']);
            // Each call compares a copy with its own option, never with the other rows.
            expect(isEquals.mock.calls.every(([value, option]) => value.id === option.id)).toBe(true);
        });

        it('should match an equal copy with its keys in a different order', () => {
            const options = cities();
            const wrapper = mountListbox({ multiple: true, options, modelValue: [{ code: 'RM', name: 'Rome' }] });

            expect(selectedLabels(wrapper)).toEqual(['Rome']);
        });

        it('should match a copy that has the same top-level fields only if the nested fields are equal too', async () => {
            const options = [
                { name: 'A', meta: { tags: ['x'] } },
                { name: 'B', meta: { tags: ['y'] } }
            ];
            const wrapper = mountItems({ options, modelValue: [{ name: 'A', meta: { tags: ['x'] } }] });

            expect(selectedLabels(wrapper)).toEqual(['A']);

            await wrapper.setProps({ modelValue: [{ name: 'A', meta: { tags: ['z'] } }] });

            expect(selectedLabels(wrapper)).toEqual([]);
        });

        it('should tell long strings with the same start apart', () => {
            const start = 'The same first sixteen characters and then';
            const options = [
                { name: 'First', note: `${start} one` },
                { name: 'Second', note: `${start} two` },
                { name: 'Third', note: `${start} one!` }
            ];
            const wrapper = mountItems({ options, modelValue: [{ name: 'First', note: `${start} one` }] });

            expect(selectedLabels(wrapper)).toEqual(['First']);
        });

        it('should not match a copy whose field differs only in type', () => {
            const wrapper = mountItems({ options: [{ id: 1, name: 'One' }], modelValue: [{ id: '1', name: 'One' }] });

            expect(selectedLabels(wrapper)).toEqual([]);
        });

        it('should keep showing options with equal content as selected together', () => {
            // Distinct objects that are deeply equal are the same value for deep equality, as before #730.
            const options = [
                { name: 'Same', code: 'S' },
                { name: 'Other', code: 'O' },
                { name: 'Same', code: 'S' }
            ];
            const wrapper = mountItems({ options, modelValue: [options[0]] });

            expect(wrapper.findAll('li.p-listbox-option').map((option) => option.attributes('aria-selected'))).toEqual(['true', 'false', 'true']);
        });

        it('should match equal copies of array and Date values', () => {
            const day = (date) => new Date(Date.UTC(2026, 0, date));
            const options = [
                { name: 'Pair', value: [1, 2] },
                { name: 'Triple', value: [1, 2, 3] },
                { name: 'First', value: day(1) },
                { name: 'Second', value: day(2) }
            ];
            const wrapper = mountItems({ options, optionValue: 'value', modelValue: [[1, 2], day(2)] });

            expect(selectedLabels(wrapper)).toEqual(['Pair', 'Second']);
        });

        it('should match a reactive copy and options held in a reactive array', () => {
            const options = reactive(cities());
            const wrapper = mountListbox({ multiple: true, options, modelValue: reactive([{ ...cities()[1] }, options[4]]) });

            expect(selectedLabels(wrapper)).toEqual(['Rome', 'Paris']);
        });

        it('should update when a field of a selected copy changes in place', async () => {
            const modelValue = reactive([{ name: 'Rome', code: 'XX' }]);
            const wrapper = mountListbox({ multiple: true, modelValue });

            expect(selectedLabels(wrapper)).toEqual([]);

            modelValue[0].code = 'RM';
            await nextTick();

            expect(selectedLabels(wrapper)).toEqual(['Rome']);

            modelValue[0].code = 'LDN';
            await nextTick();

            expect(selectedLabels(wrapper)).toEqual([]);
        });

        it('should update when a field of an option changes in place', async () => {
            const options = reactive(cities());
            const wrapper = mountListbox({ multiple: true, options, modelValue: [{ name: 'Rome', code: 'XX' }] });

            expect(selectedLabels(wrapper)).toEqual([]);

            options[1].code = 'XX';
            await nextTick();

            expect(selectedLabels(wrapper)).toEqual(['Rome']);
        });

        it('should only compare a copy with the options it can be equal to in findSelectedOptionIndex', () => {
            const options = items(20);
            const wrapper = mountItems({ options, modelValue: [{ ...options[12] }, { id: 99, name: 'Missing' }] });
            const isEquals = vi.spyOn(wrapper.vm, 'isEquals');

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(12);
            expect(isEquals).toHaveBeenCalledTimes(1);
        });

        it('should return the first of several equal options in findSelectedOptionIndex', () => {
            const options = [
                { name: 'Other', code: 'O' },
                { name: 'Same', code: 'S' },
                { name: 'Same', code: 'S' }
            ];
            const wrapper = mountItems({ options, modelValue: [{ name: 'Same', code: 'S' }] });

            expect(wrapper.vm.findSelectedOptionIndex()).toBe(1);
        });
    });
});
