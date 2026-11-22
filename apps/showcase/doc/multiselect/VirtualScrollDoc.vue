<template>
    <DocSectionText v-bind="$attrs">
        <p>
            VirtualScroller is used to render a long list of options efficiently like 100K records in this demo. The configuration is done with <i>virtualScrollerOptions</i> property, refer to the
            <NuxtLink to="/virtualscroller">VirtualScroller</NuxtLink> for more information about the available options as it is used internally by MultiSelect.
        </p>
        <p>
            With many options or a large selection, give MultiSelect a fast way to compare values: bind primitive values with <i>optionValue</i>, or set <i>dataKey</i> to a unique field when <i>v-model</i> holds objects. Without either, an option
            that isn't itself one of the selected objects is compared to every selected object by deep equality, which slows down as the selection grows.
        </p>
    </DocSectionText>
    <div class="card flex justify-center">
        <MultiSelect
            v-model="selectedItems"
            :options="items"
            :maxSelectedLabels="3"
            :selectAll="selectAll"
            @selectall-change="onSelectAllChange($event)"
            @change="onChange($event)"
            optionLabel="label"
            optionValue="value"
            :virtualScrollerOptions="{ itemSize: 44 }"
            filter
            placeholder="Select Item"
            class="w-full md:w-80"
        />
    </div>
    <DocSectionCode :code="code" />
</template>

<script>
export default {
    data() {
        return {
            selectedItems: null,
            selectAll: false,
            items: Array.from({ length: 100000 }, (_, i) => ({ label: `Item #${i}`, value: i })),
            code: {
                basic: `
<MultiSelect v-model="selectedItems" :options="items" :maxSelectedLabels="3" :selectAll="selectAll" optionLabel="label" optionValue="value"
    @selectall-change="onSelectAllChange($event)" @change="onChange($event)" :virtualScrollerOptions="{ itemSize: 44 }" filter placeholder="Select Item" class="w-full md:w-80" />
`,
                options: `
<template>
    <div class="card flex justify-center">
        <MultiSelect v-model="selectedItems" :options="items" :maxSelectedLabels="3" :selectAll="selectAll" optionLabel="label" optionValue="value"
            @selectall-change="onSelectAllChange($event)" @change="onChange($event)" :virtualScrollerOptions="{ itemSize: 44 }" filter placeholder="Select Item" class="w-full md:w-80" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            selectedItems: null,
            selectAll: false,
            items: Array.from({ length: 100000 }, (_, i) => ({ label: \`Item #\${i}\`, value: i }))
        };
    },
    methods: {
        onSelectAllChange(event) {
            this.selectedItems = event.checked ? this.items.map((item) => item.value) : [];
            this.selectAll = event.checked;
        },
        onChange(event) {
            this.selectAll = event.value.length === this.items.length;
        }
    }
};
<\/script>
`,
                composition: `
<template>
    <div class="card flex justify-center">
        <MultiSelect v-model="selectedItems" :options="items" :maxSelectedLabels="3" :selectAll="selectAll" optionLabel="label" optionValue="value"
            @selectall-change="onSelectAllChange($event)" @change="onChange($event)" :virtualScrollerOptions="{ itemSize: 44 }" filter placeholder="Select Item" class="w-full md:w-80" />
    </div>
</template>

<script setup>
import { ref } from 'vue';


const selectedItems = ref();
const selectAll = ref(false);
const items = ref(Array.from({ length: 100000 }, (_, i) => ({ label: \`Item #\${i}\`, value: i })));

const onSelectAllChange = (event) => {
    selectedItems.value = event.checked ? items.value.map((item) => item.value) : [];
    selectAll.value = event.checked;
};
const onChange = (event) => {
    selectAll.value = event.value.length === items.value.length;
}

<\/script>
`
            }
        };
    },
    methods: {
        onSelectAllChange(event) {
            this.selectedItems = event.checked ? this.items.map((item) => item.value) : [];
            this.selectAll = event.checked;
        },
        onChange(event) {
            this.selectAll = event.value.length === this.items.length;
        }
    }
};
</script>
