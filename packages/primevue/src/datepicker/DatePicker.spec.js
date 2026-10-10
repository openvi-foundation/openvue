import { mount } from '@vue/test-utils';
import PrimeVue from 'openvue/config';
import DatePicker from './DatePicker.vue';

describe('DatePicker.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(DatePicker, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: {
                modelValue: ''
            }
        });
    });

    it('should exist', async () => {
        expect(wrapper.find('.p-datepicker.p-component').exists()).toBe(true);
        expect(wrapper.find('.p-datepicker-input').exists()).toBe(true);

        let input = wrapper.find('.p-datepicker-input');

        await input.trigger('focus');

        expect(wrapper.find('.p-datepicker.p-component').exists()).toBe(true);
        expect(wrapper.find('.p-datepicker-today').exists()).toBe(true);
        expect(wrapper.find('.p-datepicker-prev-button').exists()).toBe(true);
        expect(wrapper.find('.p-datepicker-prev-next').exists()).toBe(false);
        expect(wrapper.find('.p-datepicker-today').text()).toEqual(new Date().getDate().toString());
    });

    it('should select a date', async () => {
        await wrapper.setProps({ inline: true });

        const event = { day: 8, month: 2, year: 2022, today: false, selectable: true };

        const onDateSelect = vi.spyOn(wrapper.vm, 'onDateSelect');

        await wrapper.vm.onDateSelect({ currentTarget: { focus: () => {} } }, event);
        expect(onDateSelect).toHaveBeenCalled();
    });

    it('should calculate the correct view date when in range mode', async () => {
        const dateOne = new Date();
        const dateTwo = new Date();

        dateTwo.setFullYear(dateOne.getFullYear(), dateOne.getMonth() + 2, dateOne.getDate());
        await wrapper.setProps({ selectionMode: 'range', showTime: true, modelValue: [dateOne, dateTwo] });

        const expectedViewDate = new Date(dateTwo.getFullYear(), dateTwo.getMonth(), 1);

        expect(wrapper.vm.viewDate.getFullYear()).toEqual(expectedViewDate.getFullYear());
        expect(wrapper.vm.viewDate.getMonth()).toEqual(expectedViewDate.getMonth());
    });

    it('should open a year view when there is selected date (fix: #6203)', async () => {
        const dateOne = new Date();

        dateOne.setFullYear(1988, 9, 10);

        await wrapper.setProps({ modelValue: dateOne });

        const input = wrapper.find('.p-datepicker-input');

        await input.trigger('focus');

        const yearSelectButton = wrapper.find('.p-datepicker .p-datepicker-select-year');

        expect(yearSelectButton.exists()).toBe(true);
        expect(yearSelectButton.text()).toBe('1988');

        await yearSelectButton.trigger('click');

        expect(wrapper.find('.p-datepicker-decade').exists()).toBe(true);
        expect(wrapper.find('.p-datepicker-decade').text()).toBe('1980 - 1989');
    });

    it('should not show other months when showOtherMonths is false', async () => {
        const dateOne = new Date();

        dateOne.setFullYear(1988, 5, 15);

        await wrapper.setProps({ modelValue: dateOne, showOtherMonths: false });

        const input = wrapper.find('.p-datepicker-input');

        await input.trigger('focus');

        expect(wrapper.find('.p-datepicker-other-month span').exists()).toBe(false);

        await input.trigger('blur');

        await wrapper.setProps({ showOtherMonths: true });

        await input.trigger('focus');

        expect(wrapper.find('.p-datepicker-other-month span').exists()).toBe(true);
    });

    it('should correctly set the year when view="year" and value is set via the input', async () => {
        const dateOne = new Date();
        const dateTwo = new Date();

        dateTwo.setFullYear(1988, 5, 15);

        await wrapper.setProps({ view: 'year', dateFormat: 'yy', modelValue: dateOne });

        const input = wrapper.find('.p-datepicker-input');

        await input.trigger('focus');

        expect(wrapper.find('.p-datepicker-decade').exists()).toBe(true);
        expect(wrapper.find('.p-datepicker-decade').text()).toBe('2020 - 2029');

        await wrapper.setProps({ modelValue: dateTwo });

        expect(wrapper.find('.p-datepicker-decade').text()).toBe('1980 - 1989');
    });

    it('should populate the time when typing a 24-hour value', async () => {
        await wrapper.setProps({ showTime: true, hourFormat: '24' });

        const input = wrapper.find('.p-datepicker-input');

        await input.setValue('06/15/1988 14:30');

        const emitted = wrapper.emitted('update:modelValue');

        expect(emitted).toBeTruthy();

        const value = emitted[emitted.length - 1][0];

        expect(value.getHours()).toBe(14);
        expect(value.getMinutes()).toBe(30);
        expect(wrapper.vm.pm).toBeNull();
    });

    it('should populate the time when typing a 12-hour value', async () => {
        await wrapper.setProps({ showTime: true, hourFormat: '12' });

        const input = wrapper.find('.p-datepicker-input');

        await input.setValue('06/15/1988 02:30 PM');

        const emitted = wrapper.emitted('update:modelValue');

        expect(emitted).toBeTruthy();

        const value = emitted[emitted.length - 1][0];

        expect(value.getHours()).toBe(14);
        expect(value.getMinutes()).toBe(30);
        expect(wrapper.vm.pm).toBe(true);
    });

    describe('navigator button aria-labels', () => {
        const prevLabel = () => wrapper.find('.p-datepicker-prev-button').attributes('aria-label');
        const nextLabel = () => wrapper.find('.p-datepicker-next-button').attributes('aria-label');

        beforeEach(async () => {
            await wrapper.setProps({ inline: true });
            await wrapper.setData({ currentMonth: 0, currentYear: 2026 });
        });

        it('should include the target month in date view', () => {
            expect(prevLabel()).toBe('Previous Month, December 2025');
            expect(nextLabel()).toBe('Next Month, February 2026');
        });

        it('should include the target year in month view', async () => {
            await wrapper.setData({ currentView: 'month' });

            expect(prevLabel()).toBe('Previous Year, 2025');
            expect(nextLabel()).toBe('Next Year, 2027');
        });

        it('should include the target decade in year view', async () => {
            await wrapper.setData({ currentView: 'year' });

            expect(prevLabel()).toBe('Previous Decade, 2010 - 2019');
            expect(nextLabel()).toBe('Next Decade, 2030 - 2039');
        });

        it('should point the next button past the last visible month', async () => {
            await wrapper.setProps({ numberOfMonths: 2 });

            expect(nextLabel()).toBe('Next Month, March 2026');
        });

        it('should update after navigating', async () => {
            await wrapper.find('.p-datepicker-next-button').trigger('click');

            expect(prevLabel()).toBe('Previous Month, January 2026');
            expect(nextLabel()).toBe('Next Month, March 2026');
        });
    });
});
