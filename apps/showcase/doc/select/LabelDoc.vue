<template>
    <DocSectionText v-bind="$attrs">
        <p>
            A native <i>label</i> is associated with the Select when its <i>for</i> attribute matches the <i>labelId</i> property. Clicking the label focuses the Select and the label text becomes its accessible name. Help text or a validation message
            is associated with <i>aria-describedby</i>, and <i>aria-required</i> marks the Select as required. The deprecated <i>inputId</i> property is still supported.
        </p>
        <p>Click each label, change the selected city and clear it with the keyboard to see how the focus, the accessible name and the description behave.</p>
    </DocSectionText>
    <div class="card flex flex-wrap justify-center items-start gap-8">
        <div v-for="example of examples" :key="example.id" class="flex flex-col gap-2 w-full md:w-56">
            <label :for="example.id" class="font-semibold" @click="onLabelClick(example)">{{ example.label }}</label>
            <Select
                v-if="example.editable"
                v-model="example.value"
                :labelId="example.id"
                editable
                showClear
                :options="cities"
                optionLabel="name"
                placeholder="Select a City"
                :aria-describedby="`${example.id}_help`"
                aria-required="true"
                class="w-full"
            />
            <Select
                v-else-if="example.useLabelId"
                v-model="example.value"
                :labelId="example.id"
                showClear
                :options="cities"
                optionLabel="name"
                placeholder="Select a City"
                :aria-describedby="`${example.id}_help`"
                aria-required="true"
                class="w-full"
            />
            <Select v-else v-model="example.value" :inputId="example.id" showClear :options="cities" optionLabel="name" placeholder="Select a City" :aria-describedby="`${example.id}_help`" aria-required="true" class="w-full" />
            <small :id="`${example.id}_help`">Where do you want to travel?</small>
            <dl class="text-sm text-surface-500 dark:text-surface-400 m-0">
                <dt class="font-medium">Focusable element</dt>
                <dd class="m-0 mb-1">
                    <code>{{ example.info.element }}</code>
                </dd>
                <dt class="font-medium">Label click focuses it</dt>
                <dd class="m-0 mb-1">{{ example.labelClickFocused === null ? 'Click the label' : example.labelClickFocused ? 'Yes' : 'No' }}</dd>
                <dt class="font-medium">Accessible name</dt>
                <dd class="m-0 mb-1">
                    "{{ example.info.name }}" <span class="italic">(from {{ example.info.source }})</span>
                </dd>
                <dt class="font-medium">Description</dt>
                <dd class="m-0 mb-1">"{{ example.info.description }}"</dd>
                <dt class="font-medium">Required</dt>
                <dd class="m-0">{{ example.info.required ? 'Yes' : 'No' }}</dd>
            </dl>
        </div>
    </div>
    <DocSectionCode :code="code" />
</template>

<script>
export default {
    data() {
        return {
            examples: [
                { id: 'label_inputid', label: 'City (inputId)', useLabelId: false, editable: false, value: null, labelClickFocused: null, info: {} },
                { id: 'label_labelid', label: 'City (labelId)', useLabelId: true, editable: false, value: null, labelClickFocused: null, info: {} },
                { id: 'label_editable', label: 'City (editable)', useLabelId: true, editable: true, value: null, labelClickFocused: null, info: {} }
            ],
            cities: [
                { name: 'New York', code: 'NY' },
                { name: 'Rome', code: 'RM' },
                { name: 'London', code: 'LDN' },
                { name: 'Istanbul', code: 'IST' },
                { name: 'Paris', code: 'PRS' }
            ],
            code: {
                basic: `
<label for="city">City</label>
<Select v-model="selectedCity" labelId="city" showClear :options="cities" optionLabel="name" placeholder="Select a City"
    aria-describedby="city_help" aria-required="true" class="w-full" />
<small id="city_help">Where do you want to travel?</small>
`,
                options: `
<template>
    <div class="card flex justify-center">
        <div class="flex flex-col gap-2 w-full md:w-56">
            <label for="city" class="font-semibold">City</label>
            <Select v-model="selectedCity" labelId="city" showClear :options="cities" optionLabel="name" placeholder="Select a City"
                aria-describedby="city_help" aria-required="true" class="w-full" />
            <small id="city_help">Where do you want to travel?</small>
        </div>
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
        <div class="flex flex-col gap-2 w-full md:w-56">
            <label for="city" class="font-semibold">City</label>
            <Select v-model="selectedCity" labelId="city" showClear :options="cities" optionLabel="name" placeholder="Select a City"
                aria-describedby="city_help" aria-required="true" class="w-full" />
            <small id="city_help">Where do you want to travel?</small>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

const selectedCity = ref(null);
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
    },
    mounted() {
        // Select links the label after its own mount, so read the attributes once that render has happened
        this.$nextTick(this.updateInfo);
    },
    watch: {
        examples: {
            deep: true,
            handler() {
                this.$nextTick(this.updateInfo);
            }
        }
    },
    methods: {
        onLabelClick(example) {
            setTimeout(() => {
                example.labelClickFocused = document.activeElement === document.getElementById(example.id);
                this.updateInfo();
            });
        },
        updateInfo() {
            this.examples.forEach((example) => {
                const info = this.getElementInfo(document.getElementById(example.id));

                if (JSON.stringify(info) !== JSON.stringify(example.info)) {
                    example.info = info;
                }
            });
        },
        getTextOfIds(ids) {
            return (ids || '')
                .split(/\s+/)
                .map((id) => document.getElementById(id)?.textContent.trim())
                .filter(Boolean)
                .join(' ');
        },
        // Approximates the accessible name computation: aria-labelledby, then aria-label, then an associated native label.
        getElementInfo(el) {
            if (!el) {
                return { element: 'not found', name: '', source: 'nothing', description: '', required: false };
            }

            const element = `<${el.tagName.toLowerCase()} role="${el.getAttribute('role')}">`;
            const description = this.getTextOfIds(el.getAttribute('aria-describedby'));
            const required = el.getAttribute('aria-required') === 'true';
            const labelledby = el.getAttribute('aria-labelledby');
            const ariaLabel = el.getAttribute('aria-label');

            if (labelledby) {
                return { element, name: this.getTextOfIds(labelledby), source: 'aria-labelledby', description, required };
            } else if (ariaLabel) {
                return { element, name: ariaLabel, source: 'aria-label', description, required };
            } else if (el.labels?.length) {
                return { element, name: el.labels[0].textContent.trim(), source: '<label for>', description, required };
            }

            return { element, name: '', source: 'nothing', description, required };
        }
    }
};
</script>
