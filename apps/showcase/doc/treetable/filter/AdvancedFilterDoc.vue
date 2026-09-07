<template>
    <DocSectionText v-bind="$attrs">
        <p>
            When <i>filterDisplay</i> is set as <i>menu</i>, the filtering UI is placed inside a popover with support for multiple constraints and advanced templating, using the same <i>filters</i> model as DataTable. On a tree, every constraint is
            matched against the subtree of a node following the <i>filterMode</i> rule. With the <i>and</i> operator the constraints are applied one after another, each one narrowing the branches left by the previous one, whereas <i>or</i> keeps
            every branch that satisfies any of the constraints. The global filter accepts a <i>value</i> and <i>matchMode</i> as well and is restricted to the <i>globalFilterFields</i> when defined.
        </p>
    </DocSectionText>
    <DeferredDemo @load="loadDemoData">
        <div class="card">
            <div class="flex justify-center mb-6">
                <SelectButton v-model="filterMode" optionLabel="label" dataKey="label" :options="filterOptions" />
            </div>
            <TreeTable v-model:filters="filters" :value="nodes" :filterMode="filterMode.value" filterDisplay="menu" :globalFilterFields="['name', 'size', 'type']">
                <template #header>
                    <div class="flex justify-between">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" variant="outlined" @click="clearFilter()" />
                        <IconField>
                            <InputIcon class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Global Search" />
                        </IconField>
                    </div>
                </template>
                <template #empty> No nodes found.</template>
                <Column field="name" header="Name" expander style="min-width: 12rem">
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
                    </template>
                </Column>
                <Column field="size" header="Size" style="min-width: 12rem">
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" type="text" placeholder="Search by size" />
                    </template>
                </Column>
                <Column field="type" header="Type" style="min-width: 12rem">
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" type="text" placeholder="Search by type" />
                    </template>
                </Column>
            </TreeTable>
        </div>
    </DeferredDemo>
    <DocSectionCode :code="code" :service="['NodeService']" />
</template>

<script>
import { NodeService } from '@/service/NodeService';
import { FilterMatchMode, FilterOperator } from '@openvue/core/api';

export default {
    data() {
        return {
            nodes: null,
            filters: null,
            filterMode: { label: 'Lenient', value: 'lenient' },
            filterOptions: [
                { label: 'Lenient', value: 'lenient' },
                { label: 'Strict', value: 'strict' }
            ],
            code: {
                basic: `
<SelectButton v-model="filterMode" optionLabel="label" dataKey="label" :options="filterOptions" />
<TreeTable v-model:filters="filters" :value="nodes" :filterMode="filterMode.value" filterDisplay="menu" :globalFilterFields="['name', 'size', 'type']">
    <template #header>
        <div class="flex justify-between">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" variant="outlined" @click="clearFilter()" />
            <IconField>
                <InputIcon class="pi pi-search" />
                <InputText v-model="filters['global'].value" placeholder="Global Search" />
            </IconField>
        </div>
    </template>
    <template #empty> No nodes found.</template>
    <Column field="name" header="Name" expander style="min-width: 12rem">
        <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
        </template>
    </Column>
    <Column field="size" header="Size" style="min-width: 12rem">
        <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" placeholder="Search by size" />
        </template>
    </Column>
    <Column field="type" header="Type" style="min-width: 12rem">
        <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" placeholder="Search by type" />
        </template>
    </Column>
</TreeTable>
`,
                options: `
<template>
    <div class="card">
        <div class="flex justify-center mb-6">
            <SelectButton v-model="filterMode" optionLabel="label" dataKey="label" :options="filterOptions" />
        </div>
        <TreeTable v-model:filters="filters" :value="nodes" :filterMode="filterMode.value" filterDisplay="menu" :globalFilterFields="['name', 'size', 'type']">
            <template #header>
                <div class="flex justify-between">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" variant="outlined" @click="clearFilter()" />
                    <IconField>
                        <InputIcon class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Global Search" />
                    </IconField>
                </div>
            </template>
            <template #empty> No nodes found.</template>
            <Column field="name" header="Name" expander style="min-width: 12rem">
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
                </template>
            </Column>
            <Column field="size" header="Size" style="min-width: 12rem">
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by size" />
                </template>
            </Column>
            <Column field="type" header="Type" style="min-width: 12rem">
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by type" />
                </template>
            </Column>
        </TreeTable>
    </div>
</template>

<script>
import { NodeService } from '@/service/NodeService';
import { FilterMatchMode, FilterOperator } from '@openvue/core/api';

export default {
    data() {
        return {
            nodes: null,
            filters: null,
            filterMode: { label: 'Lenient', value: 'lenient' },
            filterOptions: [
                { label: 'Lenient', value: 'lenient' },
                { label: 'Strict', value: 'strict' }
            ]
        }
    },
    created() {
        this.initFilters();
    },
    mounted() {
        NodeService.getTreeTableNodes().then((data) => (this.nodes = data));
    },
    methods: {
        clearFilter() {
            this.initFilters();
        },
        initFilters() {
            this.filters = {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
                size: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                type: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
            };
        }
    }
}
<\/script>
`,
                composition: `
<template>
    <div class="card">
        <div class="flex justify-center mb-6">
            <SelectButton v-model="filterMode" optionLabel="label" dataKey="label" :options="filterOptions" />
        </div>
        <TreeTable v-model:filters="filters" :value="nodes" :filterMode="filterMode.value" filterDisplay="menu" :globalFilterFields="['name', 'size', 'type']">
            <template #header>
                <div class="flex justify-between">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" variant="outlined" @click="clearFilter()" />
                    <IconField>
                        <InputIcon class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Global Search" />
                    </IconField>
                </div>
            </template>
            <template #empty> No nodes found.</template>
            <Column field="name" header="Name" expander style="min-width: 12rem">
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
                </template>
            </Column>
            <Column field="size" header="Size" style="min-width: 12rem">
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by size" />
                </template>
            </Column>
            <Column field="type" header="Type" style="min-width: 12rem">
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by type" />
                </template>
            </Column>
        </TreeTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { NodeService } from '@/service/NodeService';
import { FilterMatchMode, FilterOperator } from '@openvue/core/api';

onMounted(() => {
    NodeService.getTreeTableNodes().then((data) => (nodes.value = data));
});

const nodes = ref();
const filters = ref();
const filterMode = ref({ label: 'Lenient', value: 'lenient' });
const filterOptions = ref([
    { label: 'Lenient', value: 'lenient' },
    { label: 'Strict', value: 'strict' }
]);

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        size: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        type: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
    };
};

initFilters();

const clearFilter = () => {
    initFilters();
};
<\/script>
`,
                data: `
{
    key: '0',
    data: {
        name: 'Applications',
        size: '100kb',
        type: 'Folder'
    },
    children: [
        {
            key: '0-0',
            data: {
                name: 'Vue',
                size: '25kb',
                type: 'Folder'
            },
            children: [
                {
                    key: '0-0-0',
                    data: {
                        name: 'vue.app',
                        size: '10kb',
                        type: 'Application'
                    }
                },
                ...
            ]
        },
        ...
    ]
},
...
`
            }
        };
    },
    created() {
        this.initFilters();
    },
    methods: {
        loadDemoData() {
            NodeService.getTreeTableNodes().then((data) => (this.nodes = data));
        },
        clearFilter() {
            this.initFilters();
        },
        initFilters() {
            this.filters = {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
                size: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                type: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
            };
        }
    }
};
</script>
