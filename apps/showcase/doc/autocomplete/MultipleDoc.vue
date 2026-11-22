<template>
    <DocSectionText v-bind="$attrs">
        <p>Multiple mode is enabled using <i>multiple</i> property used to select more than one value from the autocomplete. In this case, value reference should be an array.</p>
        <p>
            When the value holds objects and many of them can be selected, set <i>dataKey</i> to a unique field of the suggestions. Suggestions are then matched to the selected values by that field, which stays fast with a large selection. Without
            it, a suggestion that isn't the same object as a selected value, such as one returned again by a new search, is compared to every selected object by deep equality, which slows down as the selection grows.
        </p>
        <p>
            AutoComplete picks up every change to the value array that Vue can track, such as calling <i>push</i> or <i>splice</i> on an array held in a <i>ref</i> or <i>reactive</i>, or assigning a new array. Changes Vue doesn't track, such as
            pushing into a <i>shallowRef</i> or <i>markRaw</i> array, are not detected; assign a new array instead, e.g. <i>selected.value = [...selected.value, item]</i>.
        </p>
    </DocSectionText>
    <div class="card">
        <label for="multiple-ac-1" class="font-bold mb-2 block">With Typeahead</label>
        <AutoComplete v-model="value1" inputId="multiple-ac-1" multiple fluid :suggestions="items" @complete="search" />

        <label for="multiple-ac-2" class="font-bold mt-8 mb-2 block">Without Typeahead</label>
        <AutoComplete v-model="value2" inputId="multiple-ac-2" multiple fluid @complete="search" :typeahead="false" />
    </div>
    <DocSectionCode :code="code" />
</template>

<script>
export default {
    data() {
        return {
            value1: null,
            value2: null,
            items: [],
            code: {
                basic: `
<label for="multiple-ac-1" class="font-bold mb-2 block">With Typeahead</label>
<AutoComplete v-model="value1" inputId="multiple-ac-1" multiple fluid :suggestions="items" @complete="search" />

<label for="multiple-ac-2" class="font-bold mt-8 mb-2 block">Without Typeahead</label>
<AutoComplete v-model="value2" inputId="multiple-ac-2" multiple fluid @complete="search" :typeahead="false" />
`,
                options: `
<template>
    <div class="card">
        <label for="multiple-ac-1" class="font-bold mb-2 block">With Typeahead</label>
        <AutoComplete v-model="value1" inputId="multiple-ac-1" multiple fluid :suggestions="items" @complete="search" />

        <label for="multiple-ac-2" class="font-bold mt-8 mb-2 block">Without Typeahead</label>
        <AutoComplete v-model="value2" inputId="multiple-ac-2" mulmultiple fluidtiple @complete="search" :typeahead="false" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            value1: null,
            value2: null,
            items: []
        };
    },
    methods: {
        search(event) {
            this.items = [...Array(10).keys()].map((item) => event.query + '-' + item);
        }
    }
};
<\/script>
`,
                composition: `
<template>
    <div class="card">
        <label for="multiple-ac-1" class="font-bold mb-2 block">With Typeahead</label>
        <AutoComplete v-model="value1" inputId="multiple-ac-1" multiple fluid :suggestions="items" @complete="search" />

        <label for="multiple-ac-2" class="font-bold mt-8 mb-2 block">Without Typeahead</label>
        <AutoComplete v-model="value2" inputId="multiple-ac-2" multiple fluid @complete="search" :typeahead="false" />
    </div>
</template>

<script setup>
import { ref } from "vue";

const value1 = ref(null);
const value2 = ref(null);
const items = ref([]);

const search = (event) => {
    items.value = [...Array(10).keys()].map((item) => event.query + '-' + item);
}
<\/script>
`
            }
        };
    },
    methods: {
        search(event) {
            this.items = [...Array(10).keys()].map((item) => event.query + '-' + item);
        }
    }
};
</script>
