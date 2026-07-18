import { mount } from '@vue/test-utils';
import Listbox from './Listbox.vue';

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

    describe('option groups', () => {
        const groupedOptions = [
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

        it('should render group headers with role=group, self-referencing aria-labelledby, and aria-owns listing their options', async () => {
            await wrapper.setProps({
                optionGroupLabel: 'label',
                optionLabel: 'label',
                optionGroupChildren: 'items',
                options: groupedOptions
            });

            const optionGroups = wrapper.findAll('.p-listbox-option-group');

            expect(optionGroups.length).toBe(2);

            const germanyHeader = optionGroups[0];
            const germanyId = germanyHeader.attributes('id');

            expect(germanyHeader.attributes('role')).toBe('group');
            expect(germanyHeader.attributes('aria-labelledby')).toBe(germanyId);

            const germanyOwnedIds = germanyHeader.attributes('aria-owns').split(' ');

            expect(germanyOwnedIds.length).toBe(4);
            expect(wrapper.find(`#${germanyOwnedIds[0]}`).text()).toBe('Berlin');
            expect(wrapper.find(`#${germanyOwnedIds[3]}`).text()).toBe('Munich');

            const usaHeader = optionGroups[1];
            const usaOwnedIds = usaHeader.attributes('aria-owns').split(' ');

            expect(usaOwnedIds.length).toBe(4);
            expect(wrapper.find(`#${usaOwnedIds[0]}`).text()).toBe('Chicago');
            expect(wrapper.find(`#${usaOwnedIds[3]}`).text()).toBe('San Francisco');
        });

        it('should leave real option roles/aria attributes unchanged', async () => {
            await wrapper.setProps({
                optionGroupLabel: 'label',
                optionLabel: 'label',
                optionGroupChildren: 'items',
                options: groupedOptions
            });

            const options = wrapper.findAll('.p-listbox-option');

            expect(options.length).toBe(8);
            expect(options[0].attributes('role')).toBe('option');
            expect(options[0].attributes('aria-label')).toBe('Berlin');
            expect(options[0].attributes('aria-selected')).toBe('false');
            expect(options[0].attributes('aria-setsize')).toBe('8');
            expect(options[0].attributes('aria-posinset')).toBe('1');
            // 5th real option (Chicago) sits after 2 headers, so its raw visibleOptions index is 6,
            // but its posinset should still count only real options
            expect(options[4].attributes('aria-posinset')).toBe('5');
        });

        it('should still skip group headers in keyboard navigation', async () => {
            await wrapper.setProps({
                optionGroupLabel: 'label',
                optionLabel: 'label',
                optionGroupChildren: 'items',
                options: groupedOptions
            });

            expect(wrapper.vm.isValidOption(wrapper.vm.visibleOptions[0])).toBe(false); // Germany header
            expect(wrapper.vm.findFirstOptionIndex()).toBe(1); // Berlin
            expect(wrapper.vm.findNextOptionIndex(4)).toBe(6); // Munich(4) -> skips USA header(5) -> Chicago(6)
        });
    });
});
