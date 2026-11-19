<template>
    <DocSectionText v-bind="$attrs">
        <p>
            MultiSelect is used with the <i>v-model</i> property for two-way value binding along with the <i>options</i> collection. Label and value of an option are defined with the <i>optionLabel</i> and <i>optionValue</i> properties respectively.
            Note that, when options are simple primitive values such as a string array, no <i>optionLabel</i> and <i>optionValue</i> would be necessary.
        </p>
        <p>
            MultiSelect picks up every change to the selection array that Vue can track, such as calling <i>push</i> or <i>splice</i> on an array held in a <i>ref</i> or <i>reactive</i>, or assigning a new array. Changes Vue doesn't track, such as
            pushing into a <i>shallowRef</i> or <i>markRaw</i> array, are not detected; assign a new array instead, e.g. <i>selected.value = [...selected.value, item]</i>.
        </p>
    </DocSectionText>
    <div class="card flex justify-center">
        <MultiSelect v-model="selectedCities" :options="cities" optionLabel="name" filter placeholder="Select Cities" :maxSelectedLabels="3" class="w-full md:w-80" />
    </div>
    <DocSectionCode :code="code" />
</template>

<script>
export default {
    data() {
        return {
            selectedCities: null,
            cities: [
                { name: 'New York', code: 'NY' },
                { name: 'Rome', code: 'RM' },
                { name: 'London', code: 'LDN' },
                { name: 'Istanbul', code: 'IST' },
                { name: 'Paris', code: 'PRS' }
            ],
            code: {
                basic: `
<MultiSelect v-model="selectedCities" :options="cities" optionLabel="name" filter placeholder="Select Cities"
    :maxSelectedLabels="3" class="w-full md:w-80" />
`,
                options: `
<template>
    <div class="card flex justify-center">
        <MultiSelect v-model="selectedCities" :options="cities" optionLabel="name" filter placeholder="Select Cities"
            :maxSelectedLabels="3" class="w-full md:w-80" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            selectedCities: null,
            cities: [
                { name: 'New York', code: 'NY' },
                { name: 'Rome', code: 'RM' },
                { name: 'London', code: 'LDN' },
                { name: 'Istanbul', code: 'IST' },
                { name: 'Paris', code: 'PRS' }
            ]
        };
    }
};
<\/script>
`,
                composition: `
<template>
    <div class="card flex justify-center">
        <MultiSelect v-model="selectedCities" :options="cities" optionLabel="name" filter placeholder="Select Cities"
            :maxSelectedLabels="3" class="w-full md:w-80" />
    </div>
</template>

<script setup>
import { ref } from "vue";

const selectedCities = ref();
const cities = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
<\/script>
`
            }
        };
    }
};
</script>
