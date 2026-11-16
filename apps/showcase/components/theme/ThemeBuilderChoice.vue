<template>
    <div
        :class="['theme-builder-choice', { 'theme-builder-choice-stacked': stacked }]"
        role="radiogroup"
        :aria-labelledby="ariaLabelledby"
        :style="stacked ? null : { gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }"
        @keydown="onKeyDown"
    >
        <button
            v-for="(option, index) of options"
            :key="String(option.value)"
            ref="option"
            type="button"
            role="radio"
            :class="['theme-builder-choice-option', { 'theme-builder-choice-option-active': option.value === modelValue }]"
            :aria-checked="option.value === modelValue"
            :tabindex="index === focusIndex ? 0 : -1"
            :title="option.title"
            @click="select(option)"
        >
            <slot name="option" :option="option" :active="option.value === modelValue">
                <span class="theme-builder-choice-label">{{ option.label }}</span>
                <span v-if="option.hint" class="theme-builder-choice-hint">{{ option.hint }}</span>
            </slot>
        </button>
    </div>
</template>

<script>
// Native chrome rather than an OpenVue component, so it keeps its size while the theme changes.
export default {
    emits: ['update:modelValue'],
    props: {
        modelValue: {
            type: [String, Number, Boolean],
            default: null
        },
        options: {
            type: Array,
            required: true
        },
        ariaLabelledby: {
            type: String,
            default: undefined
        },
        stacked: Boolean
    },
    methods: {
        select(option) {
            if (option.value !== this.modelValue) this.$emit('update:modelValue', option.value);
        },
        onKeyDown(event) {
            const forward = ['ArrowRight', 'ArrowDown'].includes(event.key);
            const backward = ['ArrowLeft', 'ArrowUp'].includes(event.key);

            if (!forward && !backward) return;

            event.preventDefault();

            const step = (forward ? 1 : -1) * (document.documentElement.dir === 'rtl' && !this.stacked && ['ArrowRight', 'ArrowLeft'].includes(event.key) ? -1 : 1);
            const index = (this.focusIndex + step + this.options.length) % this.options.length;

            this.select(this.options[index]);
            this.$nextTick(() => this.$refs.option?.[index]?.focus());
        }
    },
    computed: {
        focusIndex() {
            return Math.max(
                0,
                this.options.findIndex((option) => option.value === this.modelValue)
            );
        }
    }
};
</script>
