import { FilterMatchMode, FilterOperator } from '@openvue/core/api';
import { mount } from '@vue/test-utils';
import PrimeVue from 'openvue/config';
import { nextTick } from 'vue';
import Column from '../column/Column.vue';
import TreeTable from './TreeTable.vue';

window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
};

const createNodes = () => [
    {
        key: '0',
        data: { name: 'Applications', size: '100kb', type: 'Folder' },
        children: [
            {
                key: '0-0',
                data: { name: 'Vue', size: '25kb', type: 'Folder' },
                children: [
                    { key: '0-0-0', data: { name: 'vue.app', size: '10kb', type: 'Application' } },
                    { key: '0-0-1', data: { name: 'native.app', size: '10kb', type: 'Application' } }
                ]
            },
            { key: '0-1', data: { name: 'editor.app', size: '25kb', type: 'Application' } }
        ]
    },
    {
        key: '1',
        data: { name: 'Cloud', size: '20kb', type: 'Folder' },
        children: [
            { key: '1-0', data: { name: 'backup-1.zip', size: '10kb', type: 'Zip' } },
            { key: '1-1', data: { name: 'backup-2.zip', size: '10kb', type: 'Zip' } }
        ]
    },
    {
        key: '2',
        data: { name: 'Desktop', size: '150kb', type: 'Folder' },
        children: [
            { key: '2-0', data: { name: 'note-meeting.txt', size: '50kb', type: 'Text' } },
            { key: '2-1', data: { name: 'note-todo.txt', size: '100kb', type: 'Text' } }
        ]
    }
];

const keys = (nodes) => (nodes || []).map((node) => node.key);

const findNode = (nodes, key) => {
    for (const node of nodes || []) {
        if (node.key === key) return node;

        const found = findNode(node.children, key);

        if (found) return found;
    }

    return undefined;
};

const legacyTemplate = `
    <TreeTable :value="nodes" :filters="filters" :filterMode="filterMode">
        <Column field="name" header="Name" expander filterMatchMode="contains">
            <template v-if="withFilterSlot" #filter>
                <input class="legacy-name-filter" type="text" />
            </template>
        </Column>
        <Column field="size" header="Size" filterMatchMode="contains" />
        <Column field="type" header="Type" filterMatchMode="contains" />
    </TreeTable>
`;

const mountLegacy = ({ filters = {}, filterMode = 'lenient', withFilterSlot = false } = {}) =>
    mount(
        {
            components: { TreeTable, Column },
            data() {
                return { nodes: createNodes(), filters, filterMode, withFilterSlot };
            },
            template: legacyTemplate
        },
        { global: { plugins: [PrimeVue], stubs: { teleport: false, transition: false } }, attachTo: document.body }
    );

const treeTableOf = (wrapper) => wrapper.findComponent(TreeTable);

const advancedTemplate = `
    <TreeTable :value="nodes" v-model:filters="filters" :filterMode="filterMode" :filterDisplay="filterDisplay" :globalFilterFields="globalFilterFields">
        <Column field="name" header="Name" expander>
            <template v-if="withFilterSlots" #filter="{ filterModel }">
                <input class="name-filter" type="text" v-model="filterModel.value" />
            </template>
        </Column>
        <Column field="size" header="Size" />
        <Column field="type" header="Type">
            <template v-if="withFilterSlots" #filter="{ filterModel }">
                <input class="type-filter" type="text" v-model="filterModel.value" />
            </template>
        </Column>
    </TreeTable>
`;

const menuFilters = () => ({
    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    type: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
});

const rowFilters = () => ({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    type: { value: null, matchMode: FilterMatchMode.EQUALS }
});

// the filter slots use the filterDisplay scope (filterModel), so they are only rendered for the filterDisplay tests
const mountAdvanced = ({ filters, filterMode = 'lenient', filterDisplay = null, globalFilterFields = null, withFilterSlots = !!filterDisplay } = {}) =>
    mount(
        {
            components: { TreeTable, Column },
            data() {
                return { nodes: createNodes(), filters, filterMode, filterDisplay, globalFilterFields, withFilterSlots };
            },
            template: advancedTemplate
        },
        { global: { plugins: [PrimeVue], stubs: { teleport: false, transition: false } }, attachTo: document.body }
    );

describe('TreeTable', () => {
    describe('legacy filtering (flat filters, filterMatchMode on Column)', () => {
        it('should keep the whole subtree of a matching node in lenient mode', async () => {
            const wrapper = mountLegacy({ filters: { name: 'vue' } });

            await nextTick();

            const result = treeTableOf(wrapper).vm.processedData;

            expect(keys(result)).toEqual(['0']);
            expect(keys(findNode(result, '0').children)).toEqual(['0-0']);
            expect(keys(findNode(result, '0-0').children)).toEqual(['0-0-0', '0-0-1']);

            wrapper.unmount();
        });

        it('should keep filtering inside a matching node in strict mode', async () => {
            const wrapper = mountLegacy({ filters: { name: 'vue' }, filterMode: 'strict' });

            await nextTick();

            const result = treeTableOf(wrapper).vm.processedData;

            expect(keys(result)).toEqual(['0']);
            expect(keys(findNode(result, '0').children)).toEqual(['0-0']);
            expect(keys(findNode(result, '0-0').children)).toEqual(['0-0-0']);

            wrapper.unmount();
        });

        it('should apply a legacy global string filter across all columns', async () => {
            const wrapper = mountLegacy({ filters: { global: 'zip' } });

            await nextTick();

            const result = treeTableOf(wrapper).vm.processedData;

            expect(keys(result)).toEqual(['1']);
            expect(keys(findNode(result, '1').children)).toEqual(['1-0', '1-1']);

            wrapper.unmount();
        });

        it('should combine a column filter with a legacy global filter', async () => {
            const wrapper = mountLegacy({ filters: { name: 'note', global: 'todo' } });

            await nextTick();

            const result = treeTableOf(wrapper).vm.processedData;

            expect(keys(result)).toEqual(['2']);
            expect(keys(findNode(result, '2').children)).toEqual(['2-1']);

            wrapper.unmount();
        });

        it('should not render a filter row when no column has a filter slot', async () => {
            const wrapper = mountLegacy();

            await nextTick();

            expect(wrapper.findAll('thead tr').length).toBe(1);

            wrapper.unmount();
        });

        it('should render the user-authored filter row when a column has a filter slot', async () => {
            const wrapper = mountLegacy({ withFilterSlot: true });

            await nextTick();

            const headerRows = wrapper.findAll('thead tr');

            expect(headerRows.length).toBe(2);
            expect(headerRows[1].find('.legacy-name-filter').exists()).toBe(true);
            expect(headerRows[1].findAll('th').length).toBe(3);

            wrapper.unmount();
        });
    });

    describe('advanced filtering (filter meta objects)', () => {
        it('should filter with a single { value, matchMode } constraint', async () => {
            const wrapper = mountAdvanced({ filters: { name: { value: 'vue', matchMode: FilterMatchMode.CONTAINS } } });

            await nextTick();

            const result = treeTableOf(wrapper).vm.processedData;

            expect(keys(result)).toEqual(['0']);
            expect(keys(findNode(result, '0').children)).toEqual(['0-0']);
            expect(keys(findNode(result, '0-0').children)).toEqual(['0-0-0', '0-0-1']);

            wrapper.unmount();
        });

        it('should apply "and" constraints in sequence, each pruning what the previous one left', async () => {
            const wrapper = mountAdvanced({
                filters: {
                    name: {
                        operator: FilterOperator.AND,
                        constraints: [
                            { value: 'app', matchMode: FilterMatchMode.CONTAINS },
                            { value: 'native', matchMode: FilterMatchMode.CONTAINS }
                        ]
                    }
                }
            });

            await nextTick();

            const result = treeTableOf(wrapper).vm.processedData;

            // "app" matches the Applications folder itself (subtree kept), "native" then prunes it down to native.app
            expect(keys(result)).toEqual(['0']);
            expect(keys(findNode(result, '0').children)).toEqual(['0-0']);
            expect(keys(findNode(result, '0-0').children)).toEqual(['0-0-1']);

            wrapper.unmount();
        });

        it('should drop a node whose subtree does not satisfy every "and" constraint', async () => {
            const wrapper = mountAdvanced({
                filters: {
                    name: {
                        operator: FilterOperator.AND,
                        constraints: [
                            { value: 'vue', matchMode: FilterMatchMode.CONTAINS },
                            { value: 'editor', matchMode: FilterMatchMode.CONTAINS }
                        ]
                    }
                }
            });

            await nextTick();

            // Vue and editor.app are siblings, so no branch satisfies both constraints
            expect(keys(treeTableOf(wrapper).vm.processedData)).toEqual([]);

            wrapper.unmount();
        });

        it('should keep every branch matching any "or" constraint', async () => {
            const wrapper = mountAdvanced({
                filters: {
                    name: {
                        operator: FilterOperator.OR,
                        constraints: [
                            { value: 'backup-1', matchMode: FilterMatchMode.CONTAINS },
                            { value: 'todo', matchMode: FilterMatchMode.CONTAINS }
                        ]
                    }
                }
            });

            await nextTick();

            const result = treeTableOf(wrapper).vm.processedData;

            expect(keys(result)).toEqual(['1', '2']);
            expect(keys(findNode(result, '1').children)).toEqual(['1-0']);
            expect(keys(findNode(result, '2').children)).toEqual(['2-1']);

            wrapper.unmount();
        });

        it('should honor strict mode with constraint objects', async () => {
            const wrapper = mountAdvanced({ filters: { name: { value: 'vue', matchMode: FilterMatchMode.CONTAINS } }, filterMode: 'strict' });

            await nextTick();

            const result = treeTableOf(wrapper).vm.processedData;

            expect(keys(findNode(result, '0-0').children)).toEqual(['0-0-0']);

            wrapper.unmount();
        });

        it('should ignore constraints without a value and return the input untouched when nothing is active', async () => {
            const wrapper = mountAdvanced({ filters: menuFilters() });

            await nextTick();

            const treeTable = treeTableOf(wrapper);
            const result = treeTable.vm.processedData;

            expect(result).toBe(treeTable.vm.value);
            expect(keys(result)).toEqual(['0', '1', '2']);
            expect(keys(findNode(result, '0-0').children)).toEqual(['0-0-0', '0-0-1']);

            wrapper.unmount();
        });

        it('should combine column constraints with a global filter object', async () => {
            const wrapper = mountAdvanced({
                filters: {
                    name: { value: 'note', matchMode: FilterMatchMode.CONTAINS },
                    global: { value: 'todo', matchMode: FilterMatchMode.CONTAINS }
                }
            });

            await nextTick();

            const result = treeTableOf(wrapper).vm.processedData;

            expect(keys(result)).toEqual(['2']);
            expect(keys(findNode(result, '2').children)).toEqual(['2-1']);

            wrapper.unmount();
        });

        it('should restrict the global filter to globalFilterFields', async () => {
            const filters = { global: { value: 'text', matchMode: FilterMatchMode.CONTAINS } };
            const byName = mountAdvanced({ filters, globalFilterFields: ['name'] });
            const byType = mountAdvanced({ filters, globalFilterFields: ['type'] });

            await nextTick();

            expect(keys(treeTableOf(byName).vm.processedData)).toEqual([]);

            const result = treeTableOf(byType).vm.processedData;

            expect(keys(result)).toEqual(['2']);
            expect(keys(findNode(result, '2').children)).toEqual(['2-0', '2-1']);

            byName.unmount();
            byType.unmount();
        });
    });

    describe('filterDisplay', () => {
        it('should render inline column filters in a second header row with filterDisplay="row"', async () => {
            const wrapper = mountAdvanced({ filters: rowFilters(), filterDisplay: 'row' });

            await nextTick();

            const headerRows = wrapper.findAll('thead tr');

            expect(headerRows.length).toBe(2);
            expect(headerRows[1].findAll('th').length).toBe(3);
            expect(headerRows[1].findAll('.p-treetable-filter.p-treetable-inline-filter').length).toBe(2);
            expect(headerRows[1].find('.name-filter').exists()).toBe(true);
            expect(headerRows[1].find('.type-filter').exists()).toBe(true);
            expect(headerRows[0].find('.p-treetable-filter').exists()).toBe(false);

            wrapper.unmount();
        });

        it('should render filter menu buttons inside the header cells with filterDisplay="menu"', async () => {
            const wrapper = mountAdvanced({ filters: menuFilters(), filterDisplay: 'menu' });

            await nextTick();

            const headerRows = wrapper.findAll('thead tr');

            expect(headerRows.length).toBe(1);
            expect(headerRows[0].findAll('.p-treetable-filter.p-treetable-popover-filter').length).toBe(2);
            expect(headerRows[0].findAll('.p-treetable-column-filter-button').length).toBe(2);

            wrapper.unmount();
        });

        it('should apply the menu filter, update the filters model and reset the page', async () => {
            const wrapper = mountAdvanced({ filters: menuFilters(), filterDisplay: 'menu' });

            await nextTick();

            const treeTable = treeTableOf(wrapper);

            await wrapper.find('.p-treetable-column-filter-button').trigger('click');
            await nextTick();

            const overlay = document.querySelector('.p-treetable-filter-overlay');

            expect(overlay).not.toBeNull();
            expect(overlay.classList.contains('p-treetable-filter-overlay-popover')).toBe(true);

            const input = overlay.querySelector('.name-filter');

            input.value = 'vue';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            await nextTick();

            overlay.querySelector('.p-treetable-filter-apply-button').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            await nextTick();
            await nextTick();

            expect(treeTable.emitted('update:first')[0]).toEqual([0]);
            expect(treeTable.emitted('update:filters')[0][0].name.constraints[0].value).toBe('vue');
            expect(wrapper.vm.filters.name.constraints[0].value).toBe('vue');

            const result = treeTable.vm.processedData;

            expect(keys(result)).toEqual(['0']);
            expect(keys(findNode(result, '0').children)).toEqual(['0-0']);

            wrapper.unmount();
        });
    });
});
