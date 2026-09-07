<template>
    <DocSectionText v-bind="$attrs">
        <p>
            When <i>filterDisplay</i> is set as <i>row</i>, the filter elements are displayed in a second header row and every filterable column gets a menu to switch the match mode. In this mode the <i>filters</i> model follows the DataTable format
            where each field holds a <i>value</i> and a <i>matchMode</i>, so the match mode is part of the model instead of the <i>filterMatchMode</i> property of the Column. The <i>filterMode</i> still controls whether the descendants of a matching
            node are included as a whole or filtered further.
        </p>
    </DocSectionText>
    <DeferredDemo @load="loadDemoData">
        <div class="card">
            <div class="flex justify-center mb-6">
                <SelectButton v-model="filterMode" optionLabel="label" dataKey="label" :options="filterOptions" />
            </div>
            <TreeTable v-model:filters="filters" :value="nodes" :filterMode="filterMode.value" filterDisplay="row">
                <template #empty> No nodes found.</template>
                <Column field="name" header="Name" expander style="min-width: 12rem">
                    <template #filter="{ filterModel, filterCallback }">
                        <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" />
                    </template>
                </Column>
                <Column field="size" header="Size" style="min-width: 12rem">
                    <template #filter="{ filterModel, filterCallback }">
                        <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by size" />
                    </template>
                </Column>
                <Column field="type" header="Type" style="min-width: 12rem">
                    <template #filter="{ filterModel, filterCallback }">
                        <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by type" />
                    </template>
                </Column>
            </TreeTable>
        </div>
    </DeferredDemo>
    <DocSectionCode :code="code" :service="['NodeService']" />
</template>

<script>
import { NodeService } from '@/service/NodeService';
import { FilterMatchMode } from '@openvue/core/api';

export default {
    data() {
        return {
            nodes: null,
            filters: {
                name: { value: null, matchMode: FilterMatchMode.CONTAINS },
                size: { value: null, matchMode: FilterMatchMode.CONTAINS },
                type: { value: null, matchMode: FilterMatchMode.EQUALS }
            },
            filterMode: { label: 'Lenient', value: 'lenient' },
            filterOptions: [
                { label: 'Lenient', value: 'lenient' },
                { label: 'Strict', value: 'strict' }
            ],
            code: {
                basic: `
<SelectButton v-model="filterMode" optionLabel="label" dataKey="label" :options="filterOptions" />
<TreeTable v-model:filters="filters" :value="nodes" :filterMode="filterMode.value" filterDisplay="row">
    <template #empty> No nodes found.</template>
    <Column field="name" header="Name" expander style="min-width: 12rem">
        <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" />
        </template>
    </Column>
    <Column field="size" header="Size" style="min-width: 12rem">
        <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by size" />
        </template>
    </Column>
    <Column field="type" header="Type" style="min-width: 12rem">
        <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by type" />
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
        <TreeTable v-model:filters="filters" :value="nodes" :filterMode="filterMode.value" filterDisplay="row">
            <template #empty> No nodes found.</template>
            <Column field="name" header="Name" expander style="min-width: 12rem">
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" />
                </template>
            </Column>
            <Column field="size" header="Size" style="min-width: 12rem">
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by size" />
                </template>
            </Column>
            <Column field="type" header="Type" style="min-width: 12rem">
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by type" />
                </template>
            </Column>
        </TreeTable>
    </div>
</template>

<script>
import { NodeService } from '@/service/NodeService';
import { FilterMatchMode } from '@openvue/core/api';

export default {
    data() {
        return {
            nodes: null,
            filters: {
                name: { value: null, matchMode: FilterMatchMode.CONTAINS },
                size: { value: null, matchMode: FilterMatchMode.CONTAINS },
                type: { value: null, matchMode: FilterMatchMode.EQUALS }
            },
            filterMode: { label: 'Lenient', value: 'lenient' },
            filterOptions: [
                { label: 'Lenient', value: 'lenient' },
                { label: 'Strict', value: 'strict' }
            ]
        }
    },
    mounted() {
        NodeService.getTreeTableNodes().then((data) => (this.nodes = data));
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
        <TreeTable v-model:filters="filters" :value="nodes" :filterMode="filterMode.value" filterDisplay="row">
            <template #empty> No nodes found.</template>
            <Column field="name" header="Name" expander style="min-width: 12rem">
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" />
                </template>
            </Column>
            <Column field="size" header="Size" style="min-width: 12rem">
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by size" />
                </template>
            </Column>
            <Column field="type" header="Type" style="min-width: 12rem">
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by type" />
                </template>
            </Column>
        </TreeTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { NodeService } from '@/service/NodeService';
import { FilterMatchMode } from '@openvue/core/api';

onMounted(() => {
    NodeService.getTreeTableNodes().then((data) => (nodes.value = data));
});

const nodes = ref();
const filters = ref({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    size: { value: null, matchMode: FilterMatchMode.CONTAINS },
    type: { value: null, matchMode: FilterMatchMode.EQUALS }
});
const filterMode = ref({ label: 'Lenient', value: 'lenient' });
const filterOptions = ref([
    { label: 'Lenient', value: 'lenient' },
    { label: 'Strict', value: 'strict' }
]);
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
    methods: {
        loadDemoData() {
            NodeService.getTreeTableNodes().then((data) => (this.nodes = data));
        }
    }
};
</script>
