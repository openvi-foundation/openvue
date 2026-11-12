<template>
    <DocSectionText v-bind="$attrs">
        <p>
            Listbox allows choosing a single item by default, enable <i>multiple</i> property to choose more than one. When the optional <i>metaKeySelection</i> is present, behavior is changed in a way that selecting a new item requires meta key to
            be present.
        </p>
        <p>
            Listbox picks up every change to the selection array that Vue can track, such as calling <i>push</i> or <i>splice</i> on an array held in a <i>ref</i> or <i>reactive</i>, or assigning a new array. Changes Vue doesn't track, such as
            pushing into a <i>shallowRef</i> or <i>markRaw</i> array, are not detected; assign a new array instead, e.g. <i>selected.value = [...selected.value, item]</i>.
        </p>
    </DocSectionText>
    <div class="card flex justify-center">
        <Listbox v-model="selectedCity" :options="cities" multiple optionLabel="name" class="w-full md:w-56" />
    </div>
    <DocSectionCode :code="code" />
</template>

<script>
export default {
    data() {
        return {
            selectedCity: null,
            cities: [
                { name: 'New York', code: 'NY' },
                { name: 'Rome', code: 'RM' },
                { name: 'London', code: 'LDN' },
                { name: 'Istanbul', code: 'IST' },
                { name: 'Paris', code: 'PRS' }
            ],
            code: {
                basic: `
<Listbox v-model="selectedCity" :options="cities" multiple optionLabel="name" class="w-full md:w-56" />
`,
                options: `
<template>
    <div class="card flex justify-center">
        <Listbox v-model="selectedCity" :options="cities" multiple optionLabel="name" class="w-full md:w-56" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            selectedCity: null,
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
        <Listbox v-model="selectedCity" :options="cities" multiple optionLabel="name" class="w-full md:w-56" />
    </div>
</template>

<script setup>
import { ref } from "vue";

const selectedCity = ref();
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
