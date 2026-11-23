import { FilterMatchMode, FilterOperator } from '@openvue/core/api';
import { OverlayRegistry } from '@openvue/core/utils';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import PrimeVue from 'openvue/config';
import { nextTick } from 'vue';
import AutoComplete from '../autocomplete/AutoComplete.vue';
import CascadeSelect from '../cascadeselect/CascadeSelect.vue';
import ColorPicker from '../colorpicker/ColorPicker.vue';
import Column from '../column/Column.vue';
import ConfirmPopup from '../confirmpopup/ConfirmPopup.vue';
import DataTable from '../datatable/DataTable.vue';
import DatePicker from '../datepicker/DatePicker.vue';
import Menu from '../menu/Menu.vue';
import MultiSelect from '../multiselect/MultiSelect.vue';
import Password from '../password/Password.vue';
import Popover from '../popover/Popover.vue';
import Select from '../select/Select.vue';
import TieredMenu from '../tieredmenu/TieredMenu.vue';
import TreeSelect from '../treeselect/TreeSelect.vue';

window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
};

// Real Teleport and Transition, so the enter and leave hooks run in the order Vue runs them in the browser.
const options = (extra = {}) => ({ global: { plugins: [PrimeVue], stubs: { teleport: false, transition: false } }, attachTo: document.body, ...extra });

const flush = async () => {
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 20));
    await nextTick();
};

const waitFor = async (condition, timeout = 1000) => {
    const start = Date.now();

    while (!condition()) {
        if (Date.now() - start > timeout) throw new Error('timed out waiting for ' + condition);

        await new Promise((resolve) => setTimeout(resolve, 10));
    }
};

const press = (target) => target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, detail: 1 }));

const clickOn = async (target = document.body) => {
    press(target);
    // a Select picks the option on mousedown and its panel starts to leave before the click
    await flush();
    target.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    await flush();
};

// unmount every component after each test, also when it fails, so a failure cannot leak into the next test
enableAutoUnmount(afterEach);

describe('OverlayRegistry', () => {
    const spies = [];

    afterEach(() => {
        spies.splice(0).forEach((spy) => spy.mockRestore());
    });

    describe('registration', () => {
        const cases = [
            { name: 'Select', mount: () => mount(Select, options({ props: { options: ['A'] } })), open: (w) => w.vm.show(), close: (w) => w.vm.hide(), panel: (w) => w.vm.overlay },
            { name: 'MultiSelect', mount: () => mount(MultiSelect, options({ props: { options: ['A'] } })), open: (w) => w.vm.show(), close: (w) => w.vm.hide(), panel: (w) => w.vm.overlay },
            { name: 'AutoComplete', mount: () => mount(AutoComplete, options({ props: { suggestions: [{ name: 'A' }], optionLabel: 'name' } })), open: (w) => w.vm.show(), close: (w) => w.vm.hide(), panel: (w) => w.vm.overlay },
            {
                name: 'CascadeSelect',
                mount: () => mount(CascadeSelect, options({ props: { options: [{ name: 'A', cities: [{ cname: 'B' }] }], optionLabel: 'cname', optionGroupLabel: 'name', optionGroupChildren: ['cities'] } })),
                open: (w) => w.vm.show(),
                close: (w) => w.vm.hide(),
                panel: (w) => w.vm.overlay
            },
            { name: 'TreeSelect', mount: () => mount(TreeSelect, options({ props: { options: [{ key: '0', label: 'A' }] } })), open: (w) => w.vm.show(), close: (w) => w.vm.hide(), panel: (w) => w.vm.overlay },
            { name: 'DatePicker', mount: () => mount(DatePicker, options()), open: (w) => w.setData({ overlayVisible: true }), close: (w) => w.setData({ overlayVisible: false }), panel: (w) => w.vm.overlay },
            { name: 'ColorPicker', mount: () => mount(ColorPicker, options()), open: (w) => w.find('input').trigger('click'), close: (w) => w.setData({ overlayVisible: false }), panel: (w) => w.vm.picker },
            { name: 'Password', mount: () => mount(Password, options()), open: (w) => w.vm.onFocus(), close: (w) => w.setData({ overlayVisible: false }), panel: (w) => w.vm.overlay },
            {
                name: 'Popover',
                mount: () => mount(Popover, options({ slots: { default: 'Content' } })),
                open: (w) => w.vm.show({ currentTarget: document.body }),
                close: (w) => w.vm.hide(),
                panel: (w) => w.vm.container
            },
            {
                name: 'ConfirmPopup',
                mount: () => mount(ConfirmPopup, options({ data: () => ({ confirmation: { message: 'Sure?' } }) })),
                open: (w) => w.setData({ visible: true }),
                close: (w) => w.setData({ visible: false }),
                panel: (w) => w.vm.container
            },
            {
                name: 'Menu',
                mount: () => mount(Menu, options({ props: { popup: true, model: [{ label: 'A' }] } })),
                open: (w) => w.vm.show({ currentTarget: document.body }),
                close: (w) => w.vm.hide(),
                panel: (w) => w.vm.container
            },
            {
                name: 'TieredMenu',
                mount: () => mount(TieredMenu, options({ props: { popup: true, model: [{ label: 'A' }] } })),
                open: (w) => w.vm.show({ currentTarget: document.body }),
                close: (w) => w.vm.hide(),
                panel: (w) => w.vm.container
            },
            {
                name: 'ColumnFilter',
                mount: () =>
                    mount(
                        {
                            components: { DataTable, Column },
                            data: () => ({
                                products: [{ name: 'A' }],
                                filters: { name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] } }
                            }),
                            template:
                                '<DataTable :value="products" v-model:filters="filters" filterDisplay="menu"><Column field="name" header="Name"><template #filter="{ filterModel }"><input v-model="filterModel.value" /></template></Column></DataTable>'
                        },
                        options()
                    ),
                open: (w) => w.find('[data-pc-section="filter"] button').trigger('click'),
                close: (w) => w.findComponent({ name: 'ColumnFilter' }).setData({ overlayVisible: false }),
                panel: (w) => w.findComponent({ name: 'ColumnFilter' }).vm.overlay
            }
        ];

        it.each(cases)('$name registers its panel while it is open', async ({ mount, open, close, panel }) => {
            const wrapper = mount();
            const register = vi.spyOn(OverlayRegistry, 'register');
            const unregister = vi.spyOn(OverlayRegistry, 'unregister');

            spies.push(register, unregister);

            // Portal renders its content once it is mounted, and a panel that is open on the first render does not transition in
            await flush();
            await open(wrapper);
            await flush();

            const el = panel(wrapper);

            expect(el).toBeTruthy();
            expect(register).toHaveBeenCalledWith(el, expect.anything());
            expect(unregister).not.toHaveBeenCalledWith(el);

            // Vue clears the template ref before it calls the leave hook, so the panel must be taken from the hook
            await close(wrapper);
            await flush();

            expect(unregister).toHaveBeenCalledWith(el);
        });
    });

    describe('a real Select in the slot of', () => {
        const outers = [
            { name: 'Select', component: Select, props: { options: ['Apple'] }, slot: 'header' },
            { name: 'MultiSelect', component: MultiSelect, props: { options: ['Apple'] }, slot: 'footer' },
            { name: 'AutoComplete', component: AutoComplete, props: { suggestions: [{ name: 'Apple' }], optionLabel: 'name' }, slot: 'footer' },
            { name: 'CascadeSelect', component: CascadeSelect, props: { options: [{ name: 'A', cities: [{ cname: 'B' }] }], optionLabel: 'cname', optionGroupLabel: 'name', optionGroupChildren: ['cities'] }, slot: 'footer' },
            { name: 'TreeSelect', component: TreeSelect, props: { options: [{ key: '0', label: 'Apple' }] }, slot: 'footer' },
            { name: 'DatePicker', component: DatePicker, props: {}, slot: 'footer' }
        ];

        const mountNested = async ({ component, props, slot }, inner = '<Select ref="inner" v-model="color" :options="[\'Red\', \'Green\']" />') => {
            const wrapper = mount(
                {
                    components: { Outer: component, Select, DatePicker },
                    data: () => ({ props, color: null, date: null }),
                    template: `<Outer ref="outer" v-bind="props"><template #${slot}><div class="slot-content"><span class="slot-text">Text</span>${inner}</div></template></Outer>`
                },
                options()
            );

            await flush();

            const outer = wrapper.vm.$refs.outer;

            outer.show ? outer.show() : (outer.overlayVisible = true);
            await flush();

            // the outside click listener is bound once the panel has transitioned in
            await waitFor(() => outer.outsideClickListener);

            return { wrapper, outer };
        };

        it.each(outers)('$name stays open when an option of the Select is picked and closes on the next outside click', async (outerCase) => {
            const { wrapper, outer } = await mountNested(outerCase);
            const inner = wrapper.vm.$refs.inner;

            inner.show();
            await flush();
            await clickOn(inner.overlay.querySelector('[data-pc-section="option"]'));

            expect(wrapper.vm.color).toBe('Red');
            expect(inner.overlayVisible).toBe(false);
            expect(outer.overlayVisible).toBe(true);

            await clickOn();

            expect(outer.overlayVisible).toBe(false);
        });

        it.each(outers)('$name closes only the open Select on an outside click', async (outerCase) => {
            const { wrapper, outer } = await mountNested(outerCase);
            const inner = wrapper.vm.$refs.inner;

            inner.show();
            await flush();
            await clickOn();

            expect(inner.overlayVisible).toBe(false);
            expect(outer.overlayVisible).toBe(true);

            await clickOn();

            expect(outer.overlayVisible).toBe(false);
        });

        it.each(outers)('$name closes on the first outside click after a click on the slot content', async (outerCase) => {
            const { wrapper, outer } = await mountNested(outerCase);

            await clickOn(document.querySelector('.slot-text'));

            expect(outer.overlayVisible).toBe(true);

            await clickOn();

            expect(outer.overlayVisible).toBe(false);
        });

        it('TreeSelect stays open when a date is picked in a DatePicker in its footer and closes on the next outside click', async () => {
            const { wrapper, outer } = await mountNested(outers[4], '<DatePicker ref="inner" v-model="date" />');
            const inner = wrapper.vm.$refs.inner;

            inner.overlayVisible = true;
            await flush();
            await waitFor(() => inner.outsideClickListener);
            await clickOn(inner.overlay.querySelector('td:not(.p-datepicker-other-month) [data-pc-section="day"]'));

            // DatePicker closes 150ms after a date is picked
            await waitFor(() => !inner.overlayVisible);
            await flush();

            expect(wrapper.vm.date).toBeInstanceOf(Date);
            expect(outer.overlayVisible).toBe(true);

            await clickOn();

            expect(outer.overlayVisible).toBe(false);
        });
    });
});
