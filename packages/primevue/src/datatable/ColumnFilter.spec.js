import { FilterMatchMode, FilterOperator } from '@openvue/core/api';
import { mount } from '@vue/test-utils';
import PrimeVue from 'openvue/config';
import { nextTick } from 'vue';
import Column from '../column/Column.vue';
import DataTable from './DataTable.vue';

window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
};

const products = [
    { id: '1000', name: 'Game Controller' },
    { id: '1001', name: 'Black Watch' }
];

const mountTable = () =>
    mount(
        {
            components: { DataTable, Column },
            data() {
                return {
                    products,
                    filters: {
                        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
                    }
                };
            },
            template: `
                <DataTable :value="products" v-model:filters="filters" filterDisplay="menu">
                    <Column field="name" header="Name">
                        <template #filter="{ filterModel }">
                            <input type="text" v-model="filterModel.value" />
                        </template>
                    </Column>
                </DataTable>
            `
        },
        { global: { plugins: [PrimeVue], stubs: { teleport: false, transition: false } }, attachTo: document.body }
    );

describe('ColumnFilter', () => {
    it('should keep the filter overlay open when an option of a nested Select is clicked', async () => {
        const wrapper = mountTable();

        await nextTick();

        await wrapper.find('[data-pc-section="filter"] button').trigger('click');
        await nextTick();

        const columnFilter = wrapper.findComponent({ name: 'ColumnFilter' });
        const filterOverlay = document.querySelector('.p-datatable-filter-overlay');

        expect(filterOverlay).not.toBeNull();

        // open the operator Select rendered inside the filter overlay
        const select = filterOverlay.querySelector('[data-pc-name="pcfilteroperatordropdown"]');

        select.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        select.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await nextTick();
        await nextTick();

        // the Select overlay is portalled to the body, so it is not a DOM descendant of the filter overlay
        const selectOverlay = document.querySelector('.p-select-overlay');

        expect(selectOverlay).not.toBeNull();
        expect(filterOverlay.contains(selectOverlay)).toBe(false);

        selectOverlay.querySelector('[data-pc-section="option"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await nextTick();
        await nextTick();

        expect(columnFilter.vm.overlayVisible).toBe(true);

        wrapper.unmount();
    });

    // Under SSR (Nuxt) Vue's useId() returns nested ids such as "v-0-10", so useAttrSelector produces
    // selectors like "pc0_10" rather than the flat "pc14" seen in a client-only test environment.
    it('should recognise nested overlays whose attribute selector has an SSR-style id', async () => {
        const wrapper = mountTable();

        await nextTick();

        await wrapper.find('[data-pc-section="filter"] button').trigger('click');
        await nextTick();

        const columnFilter = wrapper.findComponent({ name: 'ColumnFilter' });
        const filterOverlay = document.querySelector('.p-datatable-filter-overlay');
        const select = filterOverlay.querySelector('[data-pc-name="pcfilteroperatordropdown"]');

        select.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        select.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await nextTick();
        await nextTick();

        const selectOverlay = document.querySelector('.p-select-overlay');
        const attrSelector = [...selectOverlay.attributes].map((attr) => attr.name).find((name) => /^pc\w+$/.test(name));

        expect(attrSelector).toBeDefined();

        // rewrite the flat selector into the nested form SSR produces, on both the overlay and its owner
        const ssrAttrSelector = attrSelector.replace(/^pc/, 'pc0_');

        selectOverlay.removeAttribute(attrSelector);
        selectOverlay.setAttribute(ssrAttrSelector, '');
        filterOverlay.querySelectorAll(`[${attrSelector}]`).forEach((el) => {
            el.removeAttribute(attrSelector);
            el.setAttribute(ssrAttrSelector, '');
        });

        const option = selectOverlay.querySelector('[data-pc-section="option"]');

        expect(columnFilter.vm.isNestedOverlayClicked(option)).toBe(true);

        option.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await nextTick();
        await nextTick();

        expect(columnFilter.vm.overlayVisible).toBe(true);

        wrapper.unmount();
    });

    it('should close the filter overlay when a genuine outside click occurs', async () => {
        const wrapper = mountTable();

        await nextTick();

        await wrapper.find('[data-pc-section="filter"] button').trigger('click');
        await nextTick();

        const columnFilter = wrapper.findComponent({ name: 'ColumnFilter' });

        expect(columnFilter.vm.overlayVisible).toBe(true);

        document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await nextTick();

        expect(columnFilter.vm.overlayVisible).toBe(false);

        wrapper.unmount();
    });
});
