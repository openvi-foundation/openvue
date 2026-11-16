<template>
    <Select
        :modelValue="selected"
        :options="options"
        optionLabel="family"
        optionValue="family"
        filter
        :filterFields="['family', 'category']"
        filterPlaceholder="Search Google Fonts…"
        :virtualScrollerOptions="{ itemSize }"
        scrollHeight="22rem"
        :loading="!options.length"
        :inputId="inputId"
        :aria-labelledby="ariaLabelledby"
        overlayClass="theme-builder-font-overlay"
        fluid
        @update:modelValue="choose"
    >
        <template #value="{ value }">
            <span class="theme-builder-font-value" :style="{ fontFamily: stack(value) }">{{ value }}</span>
        </template>
        <template #option="{ option }">
            <ThemeBuilderFontOption :entry="option" :selected="option.family === selected" />
        </template>
        <template #emptyfilter>No Google font matches that name.</template>
        <template #footer>
            <div class="theme-builder-font-footer">{{ count }} families from Google Fonts</div>
        </template>
    </Select>
</template>

<script>
import { fontStack } from '@/service/theme/compile';
import { loadFontCatalogue } from '@/service/theme/fonts';
import { markRaw } from 'vue';

// Must match .theme-builder-font-overlay.
const ITEM_SIZE = 52;

export default {
    emits: ['update:modelValue'],
    props: {
        modelValue: {
            type: String,
            required: true
        },
        inputId: {
            type: String,
            default: undefined
        },
        ariaLabelledby: {
            type: String,
            default: undefined
        }
    },
    data() {
        return {
            options: [],
            itemSize: ITEM_SIZE
        };
    },
    async mounted() {
        this.options = markRaw(await loadFontCatalogue());
    },
    methods: {
        choose(family) {
            this.$emit('update:modelValue', family === 'Inter' ? 'Inter var' : family);
        },
        stack(family) {
            return fontStack(family);
        }
    },
    computed: {
        selected() {
            return this.modelValue === 'Inter var' ? 'Inter' : this.modelValue;
        },
        count() {
            return this.options.length.toLocaleString('en-US');
        }
    }
};
</script>
