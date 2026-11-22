<template>
    <DocSectionText v-bind="$attrs">
        <p>
            VirtualScroller is used to render a long list of options efficiently like 100K records in this demo. The configuration is done with <i>virtualScrollerOptions</i> property, refer to the
            <NuxtLink to="/virtualscroller" class="doc-link">VirtualScroller</NuxtLink> for more information about the available options as it is used internally by Listbox.
        </p>
        <p>
            With many options or a large selection, give Listbox a fast way to compare values: bind primitive values with <i>optionValue</i>, or set <i>dataKey</i> to a unique field when <i>v-model</i> holds objects. Without either, objects are
            compared by deep equality. Listbox then only compares an option with the selected objects whose top-level fields hold the same values, which stays fast as long as those fields tell the objects apart, such as an id.
        </p>
    </DocSectionText>
    <div class="card flex justify-center">
        <Listbox v-model="selectedItem" :options="items" optionLabel="label" optionValue="value" :virtualScrollerOptions="{ itemSize: 38 }" class="w-full md:w-56" listStyle="height:250px" striped />
    </div>
    <DocSectionCode :code="code" />
</template>

<script>
export default {
    data() {
        return {
            selectedItem: null,
            items: Array.from({ length: 100000 }, (_, i) => ({ label: `Item #${i}`, value: i })),
            code: {
                basic: `
<Listbox v-model="selectedItem" :options="items" optionLabel="label" optionValue="value"
    :virtualScrollerOptions="{ itemSize: 38 }" class="w-full md:w-56" listStyle="height:250px" striped />
`,
                options: `
<template>
    <div class="card flex justify-center">
        <Listbox v-model="selectedItem" :options="items" optionLabel="label" optionValue="value"
            :virtualScrollerOptions="{ itemSize: 38 }" class="w-full md:w-56" listStyle="height:250px" striped />
    </div>
</template>

<script>
export default {
    data() {
        return {
            selectedItem: null,
            items: Array.from({ length: 100000 }, (_, i) => ({ label: \`Item #\${i}\`, value: i }))
        };
    }
};
<\/script>
`,
                composition: `
<template>
    <div class="card flex justify-center">
        <Listbox v-model="selectedItem" :options="items" optionLabel="label" optionValue="value"
            :virtualScrollerOptions="{ itemSize: 38 }" class="w-full md:w-56" listStyle="height:250px" striped />
    </div>
</template>

<script setup>
import { ref } from "vue";

const selectedItem = ref();
const items = ref(Array.from({ length: 100000 }, (_, i) => ({ label: \`Item #\${i}\`, value: i })));
<\/script>
`
            }
        };
    }
};
</script>
