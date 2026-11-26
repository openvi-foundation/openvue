<template>
    <DocSectionText v-bind="$attrs">
        <p>When <i>inverted</i> is present, the maximum value is placed at the start of the slider and the minimum value at the end.</p>
    </DocSectionText>
    <div class="card flex flex-wrap justify-center items-center gap-12">
        <Slider v-model="value" inverted class="w-56" />
        <Slider v-model="value" inverted orientation="vertical" class="h-56" />
    </div>
    <DocSectionCode :code="code" />
</template>

<script>
export default {
    data() {
        return {
            value: 30,
            code: {
                basic: `
<Slider v-model="value" inverted class="w-56" />
<Slider v-model="value" inverted orientation="vertical" class="h-56" />
`,
                options: `
<template>
    <div class="card flex flex-wrap justify-center items-center gap-12">
        <Slider v-model="value" inverted class="w-56" />
        <Slider v-model="value" inverted orientation="vertical" class="h-56" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            value: 30
        }
    }
};
<\/script>
`,
                composition: `
<template>
    <div class="card flex flex-wrap justify-center items-center gap-12">
        <Slider v-model="value" inverted class="w-56" />
        <Slider v-model="value" inverted orientation="vertical" class="h-56" />
    </div>
</template>

<script setup>
import { ref } from 'vue';

const value = ref(30);
<\/script>
`
            }
        };
    }
};
</script>
