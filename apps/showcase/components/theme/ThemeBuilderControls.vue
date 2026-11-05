<template>
    <div class="theme-builder-controls">
        <ThemeBuilderSection
            title="Colours"
            :summary="colorLabel(recipe.primary) + ' · ' + surfaceLabel"
            :modified="recipe.primary !== defaults.primary || recipe.surface !== defaults.surface"
            @reset="change({ primary: defaults.primary, surface: defaults.surface })"
        >
            <div class="theme-builder-field">
                <div id="tb-primary" class="theme-builder-field-label">
                    <span>Primary</span>
                    <span class="theme-builder-field-value">{{ colorLabel(recipe.primary) }}</span>
                </div>
                <div class="theme-builder-swatches" role="radiogroup" aria-labelledby="tb-primary" @keydown="onArrowKey($event, primaryColors, recipe.primary, (primary) => change({ primary }))">
                    <button
                        v-for="color of primaryColors"
                        :key="color"
                        type="button"
                        role="radio"
                        :class="['theme-builder-swatch', { 'theme-builder-swatch-active': color === recipe.primary }]"
                        :style="{ background: primarySwatch(color) }"
                        :aria-label="colorLabel(color)"
                        :aria-checked="color === recipe.primary"
                        :tabindex="color === primaryTabStop ? 0 : -1"
                        :title="colorLabel(color)"
                        @click="change({ primary: color })"
                    ></button>
                    <label
                        :class="['theme-builder-swatch', 'theme-builder-swatch-custom', { 'theme-builder-swatch-active': customPrimary }]"
                        :style="customPrimary ? { background: recipe.primary } : null"
                        :title="customPrimary ? recipe.primary : 'Pick any colour. It gets a button shade that passes WCAG AA.'"
                    >
                        <i v-if="!customPrimary" class="pi pi-plus" aria-hidden="true"></i>
                        <input type="color" class="theme-builder-color-input" :value="customPrimary ? recipe.primary : '#6366f1'" aria-label="Custom primary colour" @input="change({ primary: $event.target.value.toLowerCase() })" />
                    </label>
                </div>
                <p v-if="customPrimary" class="theme-builder-hint">Custom colours get a button shade that passes WCAG AA in light and dark mode.</p>
            </div>

            <div class="theme-builder-field">
                <div id="tb-surface" class="theme-builder-field-label">
                    <span>Surface</span>
                    <span class="theme-builder-field-value">{{ surfaceLabel }}</span>
                </div>
                <div class="theme-builder-surfaces" role="radiogroup" aria-labelledby="tb-surface" @keydown="onArrowKey($event, surfaces, recipe.surface, (surface) => change({ surface }))">
                    <button
                        v-for="surface of surfaces"
                        :key="surface"
                        type="button"
                        role="radio"
                        :class="['theme-builder-surface', { 'theme-builder-surface-active': surface === recipe.surface }]"
                        :aria-checked="surface === recipe.surface"
                        :tabindex="surface === recipe.surface ? 0 : -1"
                        :title="surface === 'default' ? recipe.base + ' default' : capitalize(surface)"
                        @click="change({ surface })"
                    >
                        <span :class="['theme-builder-surface-dot', { 'theme-builder-surface-dot-default': surface === 'default' }]" :style="surface === 'default' ? null : { background: surfaceSwatch(surface) }" aria-hidden="true"></span>
                        <span class="theme-builder-surface-name">{{ surface === 'default' ? 'Default' : capitalize(surface) }}</span>
                    </button>
                </div>
            </div>
        </ThemeBuilderSection>

        <ThemeBuilderSection
            title="Typography"
            :summary="fontLabel + ' · ' + recipe.scale + 'px'"
            :modified="recipe.font !== defaults.font || recipe.scale !== defaults.scale"
            @reset="change({ font: defaults.font, scale: defaults.scale })"
            :defaultOpen="false"
        >
            <div class="theme-builder-field">
                <div id="tb-font" class="theme-builder-field-label">
                    <span>Font</span>
                    <span class="theme-builder-field-value">Google Fonts</span>
                </div>
                <ThemeBuilderFontPicker :modelValue="recipe.font" ariaLabelledby="tb-font" @update:modelValue="change({ font: $event })" />
            </div>
            <div class="theme-builder-field">
                <div id="tb-scale" class="theme-builder-field-label">
                    <span>Text size</span>
                    <span class="theme-builder-field-value">Root font size</span>
                </div>
                <ThemeBuilderChoice :modelValue="recipe.scale" :options="scales" ariaLabelledby="tb-scale" @update:modelValue="change({ scale: $event })" />
            </div>
        </ThemeBuilderSection>

        <ThemeBuilderSection
            title="Shape"
            :summary="radiusValue + 'px · ' + capitalize(recipe.density) + ' · ' + capitalize(recipe.input)"
            :modified="recipe.radius !== defaults.radius || recipe.density !== defaults.density || recipe.input !== defaults.input"
            @reset="change({ radius: defaults.radius, density: defaults.density, input: defaults.input })"
            :defaultOpen="false"
        >
            <div class="theme-builder-field">
                <div id="tb-radius" class="theme-builder-field-label">
                    <span>Corner radius</span>
                    <span class="theme-builder-field-value">
                        {{ radiusValue }}px<template v-if="recipe.radius === null"> · base</template>
                        <button v-else type="button" class="theme-builder-link" @click="change({ radius: null })">Base</button>
                    </span>
                </div>
                <Slider :modelValue="radiusValue" :min="radiusMin" :max="radiusMax" :step="1" class="theme-builder-slider" aria-labelledby="tb-radius" @update:modelValue="change({ radius: $event })" />
                <div class="theme-builder-scale" aria-hidden="true">
                    <span>Square</span>
                    <span>Round</span>
                </div>
            </div>
            <div class="theme-builder-field">
                <div id="tb-density" class="theme-builder-field-label">
                    <span>Density</span>
                    <span class="theme-builder-field-value">Padding of fields, buttons and lists</span>
                </div>
                <ThemeBuilderChoice :modelValue="recipe.density" :options="densities" ariaLabelledby="tb-density" @update:modelValue="change({ density: $event })" />
            </div>
            <div class="theme-builder-field">
                <div id="tb-inputs" class="theme-builder-field-label">
                    <span>Inputs</span>
                </div>
                <ThemeBuilderChoice :modelValue="recipe.input" :options="inputs" ariaLabelledby="tb-inputs" @update:modelValue="change({ input: $event })" />
            </div>
        </ThemeBuilderSection>

        <div class="theme-builder-group-label">Advanced</div>

        <ThemeBuilderSection title="Focus ring" :summary="optionLabel(focusOptions, recipe.focus)" :modified="recipe.focus !== defaults.focus" @reset="change({ focus: defaults.focus })" :defaultOpen="false">
            <ThemeBuilderChoice :modelValue="recipe.focus" :options="focusOptions" ariaLabelledby="tb-section-focus-ring" @update:modelValue="change({ focus: $event })">
                <template #option="{ option }">
                    <span class="theme-builder-ring-demo" :style="ringStyle(option.value)" aria-hidden="true"></span>
                    <span class="theme-builder-choice-label">{{ option.label }}</span>
                </template>
            </ThemeBuilderChoice>
            <p class="theme-builder-hint">Press Tab inside the preview to see it on real controls.</p>
        </ThemeBuilderSection>

        <ThemeBuilderSection
            title="Motion"
            :summary="optionLabel(motionOptions, recipe.motion) + (recipe.ripple ? ' · Ripple' : '')"
            :modified="recipe.motion !== defaults.motion || recipe.ripple !== defaults.ripple"
            @reset="change({ motion: defaults.motion, ripple: defaults.ripple })"
            :defaultOpen="false"
        >
            <div class="theme-builder-field">
                <div id="tb-motion" class="theme-builder-field-label">
                    <span>Transitions</span>
                    <span class="theme-builder-field-value">{{ motionDuration }}</span>
                </div>
                <ThemeBuilderChoice :modelValue="recipe.motion" :options="motionOptions" ariaLabelledby="tb-motion" @update:modelValue="change({ motion: $event })" />
            </div>
            <div class="theme-builder-field theme-builder-field-inline">
                <label for="tb-ripple" class="theme-builder-field-label">
                    <span>Ripple</span>
                    <span class="theme-builder-field-value">Ink effect on press</span>
                </label>
                <ToggleSwitch inputId="tb-ripple" :modelValue="recipe.ripple" @update:modelValue="change({ ripple: $event })" />
            </div>
        </ThemeBuilderSection>

        <ThemeBuilderSection
            title="Depth"
            :summary="optionLabel(shadowOptions, recipe.shadow) + ' · ' + optionLabel(maskOptions, recipe.mask) + ' mask'"
            :modified="recipe.shadow !== defaults.shadow || recipe.mask !== defaults.mask || recipe.disabled !== defaults.disabled"
            @reset="change({ shadow: defaults.shadow, mask: defaults.mask, disabled: defaults.disabled })"
            :defaultOpen="false"
        >
            <div class="theme-builder-field">
                <div id="tb-shadow" class="theme-builder-field-label">
                    <span>Shadows</span>
                    <span class="theme-builder-field-value">Cards, menus and dialogs</span>
                </div>
                <ThemeBuilderChoice :modelValue="recipe.shadow" :options="shadowOptions" ariaLabelledby="tb-shadow" @update:modelValue="change({ shadow: $event })">
                    <template #option="{ option }">
                        <span :class="['theme-builder-shadow-demo', 'theme-builder-shadow-demo-' + option.value]" :style="shadowStyle(option.value)" aria-hidden="true"></span>
                        <span class="theme-builder-choice-label">{{ option.label }}</span>
                    </template>
                </ThemeBuilderChoice>
            </div>
            <div class="theme-builder-field">
                <div id="tb-mask" class="theme-builder-field-label">
                    <span>Backdrop</span>
                    <span class="theme-builder-field-value">Behind dialogs and drawers</span>
                </div>
                <ThemeBuilderChoice :modelValue="recipe.mask" :options="maskOptions" ariaLabelledby="tb-mask" @update:modelValue="change({ mask: $event })" />
            </div>
            <div class="theme-builder-field">
                <div id="tb-disabled" class="theme-builder-field-label">
                    <span>Disabled opacity</span>
                    <span class="theme-builder-field-value">
                        {{ Math.round(disabledValue * 100) }}%<template v-if="recipe.disabled === null"> · base</template>
                        <button v-else type="button" class="theme-builder-link" @click="change({ disabled: null })">Base</button>
                    </span>
                </div>
                <Slider :modelValue="Math.round(disabledValue * 100)" :min="disabledMin" :max="disabledMax" :step="5" class="theme-builder-slider" aria-labelledby="tb-disabled" @update:modelValue="change({ disabled: $event / 100 })" />
            </div>
        </ThemeBuilderSection>
    </div>
</template>

<script>
import { DENSITIES, DISABLED_MAX, DISABLED_MIN, FOCUS_RINGS, MOTIONS, PRIMARY_COLORS, SHADOWS, SURFACES, isCustomColor } from '@/service/theme/compile';
import { DEFAULT_RECIPE, FOCUS_OPTIONS, INPUT_VARIANTS, MASK_OPTIONS, MOTION_OPTIONS, RADIUS_MAX, RADIUS_MIN, SCALES, SHADOW_OPTIONS, SURFACE_OPTIONS } from '@/service/theme/recipe';
import Aura from '@openvue/themes/aura';

const LABELS = {
    default: 'Base',
    hairline: 'Hairline',
    bold: 'Bold',
    tight: 'Tight',
    off: 'Off',
    fast: 'Fast',
    slow: 'Slow',
    flat: 'Flat',
    soft: 'Soft',
    deep: 'Deep',
    light: 'Light',
    dark: 'Dark'
};

function toOptions(values) {
    return values.map((value) => ({ value, label: LABELS[value] }));
}

function tokenCss(value) {
    return String(value).replace(/\{([^}]+)\}/g, (_, path) => {
        const name = path.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\./g, '-');

        return `var(--p-${name.toLowerCase()})`;
    });
}

export default {
    emits: ['change'],
    props: {
        recipe: {
            type: Object,
            required: true
        },
        base: {
            type: Object,
            default: () => ({ radius: 6, disabled: 0.6, focusWidth: '1px', focusOffset: '2px', focusShadow: null, cardShadow: 'none', motion: '0.2s' })
        }
    },
    data() {
        return {
            defaults: DEFAULT_RECIPE,
            primaryColors: PRIMARY_COLORS,
            surfaces: SURFACE_OPTIONS,
            scales: SCALES.map((value) => ({ value, label: String(value), title: value + 'px' })),
            radiusMin: RADIUS_MIN,
            radiusMax: RADIUS_MAX,
            densities: Object.keys(DENSITIES).map((value) => ({ value, label: this.capitalize(value) })),
            inputs: INPUT_VARIANTS.map((value) => ({ value, label: this.capitalize(value) })),
            focusOptions: toOptions(FOCUS_OPTIONS),
            motionOptions: toOptions(MOTION_OPTIONS),
            shadowOptions: toOptions(SHADOW_OPTIONS),
            maskOptions: toOptions(MASK_OPTIONS),
            disabledMin: Math.round(DISABLED_MIN * 100),
            disabledMax: Math.round(DISABLED_MAX * 100)
        };
    },
    methods: {
        change(changes) {
            this.$emit('change', changes);
        },
        // Arrow keys move the choice inside a swatch group, as in ThemeBuilderChoice; Tab enters and leaves the group once.
        onArrowKey(event, values, current, select) {
            const forward = ['ArrowRight', 'ArrowDown'].includes(event.key);
            const backward = ['ArrowLeft', 'ArrowUp'].includes(event.key);

            if ((!forward && !backward) || !event.target.matches('[role="radio"]')) return;

            event.preventDefault();

            const step = (forward ? 1 : -1) * (document.documentElement.dir === 'rtl' && ['ArrowRight', 'ArrowLeft'].includes(event.key) ? -1 : 1);
            const index = (Math.max(0, values.indexOf(current)) + step + values.length) % values.length;
            const radios = event.currentTarget.querySelectorAll('[role="radio"]');

            select(values[index]);
            this.$nextTick(() => radios[index]?.focus());
        },
        capitalize(value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        },
        optionLabel(options, value) {
            return options.find((option) => option.value === value)?.label ?? value;
        },
        colorLabel(color) {
            return isCustomColor(color) ? color.toUpperCase() : color === 'noir' ? 'Ink' : this.capitalize(color);
        },
        primarySwatch(color) {
            return color === 'noir' ? 'var(--text-color)' : Aura.primitive[color][500];
        },
        // Light and dark ends of the palette, so the tint shows; the 500 shades all read as the same grey.
        surfaceSwatch(surface) {
            return `linear-gradient(135deg, ${SURFACES[surface][200]} 50%, ${SURFACES[surface][700]} 50%)`;
        },
        ringStyle(value) {
            const ring = FOCUS_RINGS[value];

            if (ring) return { outlineWidth: ring.width, outlineOffset: ring.offset };

            const shadow = this.base.focusShadow?.[this.$appState.darkTheme ? 'dark' : 'light'];

            return { outlineWidth: this.base.focusWidth, outlineOffset: this.base.focusOffset, boxShadow: shadow && shadow !== 'none' ? tokenCss(shadow) : undefined };
        },
        shadowStyle(value) {
            return { boxShadow: SHADOWS[value]?.card ?? this.base.cardShadow };
        }
    },
    computed: {
        primaryTabStop() {
            return this.primaryColors.includes(this.recipe.primary) ? this.recipe.primary : this.primaryColors[0];
        },
        customPrimary() {
            return isCustomColor(this.recipe.primary);
        },
        surfaceLabel() {
            return this.recipe.surface === 'default' ? this.recipe.base + ' surface' : this.capitalize(this.recipe.surface);
        },
        fontLabel() {
            return this.recipe.font === 'Inter var' ? 'Inter' : this.recipe.font;
        },
        radiusValue() {
            return this.recipe.radius ?? this.base.radius;
        },
        disabledValue() {
            return this.recipe.disabled ?? this.base.disabled;
        },
        motionDuration() {
            const duration = MOTIONS[this.recipe.motion] ?? this.base.motion;

            return duration === '0s' ? 'No transitions' : duration + ' per transition';
        }
    }
};
</script>
