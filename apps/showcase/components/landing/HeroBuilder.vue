<template>
    <div class="hero-builder">
        <div class="hero-builder-head">
            <div class="hero-builder-title">
                <i class="pi pi-palette" aria-hidden="true"></i>
                <span>Theme Builder</span>
            </div>
            <button type="button" class="hero-builder-style" aria-haspopup="dialog" :aria-expanded="stylesOpen" :aria-label="'Style: ' + (styleName ?? 'Custom')" @click="toggleStyles">
                <span class="theme-builder-dot" :style="{ background: swatch(recipe.primary) }" aria-hidden="true"></span>
                <span class="hero-builder-style-name">{{ styleName ?? 'Custom' }}</span>
                <i class="pi pi-chevron-down hero-builder-caret" aria-hidden="true"></i>
            </button>
        </div>

        <Popover ref="styles" class="hero-builder-styles" @show="stylesOpen = true" @hide="stylesOpen = false">
            <div class="theme-styles-head">
                <span class="theme-styles-title">Start from a style</span>
                <span class="theme-styles-count">{{ styleCount }} styles</span>
            </div>
            <ThemeStyleGrid :active="styleName" @select="chooseStyle" />
        </Popover>

        <div class="hero-builder-controls">
            <div class="theme-builder-field">
                <span id="hb-base" class="theme-builder-field-label">Base</span>
                <ThemeBuilderChoice :modelValue="recipe.base" :options="bases" ariaLabelledby="hb-base" @update:modelValue="change({ base: $event })" />
            </div>
            <div class="theme-builder-field">
                <label for="hb-font" class="theme-builder-field-label">Font</label>
                <Select :modelValue="recipe.font" :options="fonts" optionLabel="label" optionValue="value" inputId="hb-font" size="small" fluid @update:modelValue="change({ font: $event })" />
            </div>
            <div class="theme-builder-field">
                <span id="hb-colour" class="theme-builder-field-label">Colour</span>
                <div class="theme-builder-swatches" role="radiogroup" aria-labelledby="hb-colour">
                    <button
                        v-for="color of colors"
                        :key="color"
                        type="button"
                        role="radio"
                        :class="['theme-builder-swatch', { 'theme-builder-swatch-active': color === recipe.primary }]"
                        :style="{ background: swatch(color) }"
                        :aria-label="colorLabel(color)"
                        :aria-checked="color === recipe.primary"
                        :title="colorLabel(color)"
                        @click="change({ primary: color })"
                    ></button>
                    <label
                        :class="['theme-builder-swatch', 'theme-builder-swatch-custom', { 'theme-builder-swatch-active': customPrimary }]"
                        :style="customPrimary ? { background: recipe.primary } : null"
                        :title="customPrimary ? recipe.primary : 'Any colour'"
                    >
                        <i v-if="!customPrimary" class="pi pi-plus" aria-hidden="true"></i>
                        <input type="color" class="theme-builder-color-input" :value="customPrimary ? recipe.primary : '#6366f1'" aria-label="Any colour" @input="change({ primary: $event.target.value.toLowerCase() })" />
                    </label>
                </div>
            </div>
            <div class="theme-builder-field">
                <div id="hb-radius" class="theme-builder-field-label">
                    <span>Corners</span>
                    <span class="theme-builder-field-value">{{ radiusValue }}px</span>
                </div>
                <Slider :modelValue="radiusValue" :min="radiusMin" :max="radiusMax" :step="1" class="theme-builder-slider" aria-labelledby="hb-radius" @update:modelValue="change({ radius: $event })" />
            </div>
        </div>

        <div class="hero-builder-preview">
            <div class="hero-builder-card">
                <div class="hero-builder-card-title">Invite your team</div>
                <div class="hero-builder-invite">
                    <InputText v-model="email" placeholder="name@company.com" size="small" fluid aria-label="Email address" />
                    <Button label="Invite" size="small" />
                </div>
                <ul class="hero-builder-members">
                    <li v-for="member of members" :key="member.email">
                        <Avatar :label="member.initials" shape="circle" />
                        <span class="hero-builder-member">
                            <span class="hero-builder-member-name">{{ member.name }}</span>
                            <span class="hero-builder-member-email">{{ member.email }}</span>
                        </span>
                        <Tag :value="member.role" :severity="member.role === 'Pending' ? 'warn' : 'secondary'" />
                    </li>
                </ul>
                <div class="hero-builder-check hero-builder-card-end">
                    <Checkbox v-model="welcome" inputId="hb-welcome" binary />
                    <label for="hb-welcome">Send a welcome email</label>
                </div>
            </div>
            <div class="hero-builder-card">
                <div class="hero-builder-card-head">
                    <span class="hero-builder-card-title">Team plan</span>
                    <Tag value="Popular" />
                </div>
                <SelectButton v-model="billing" :options="billingOptions" :allowEmpty="false" size="small" fluid aria-label="Billing period" />
                <div class="hero-builder-price">
                    {{ billing === 'Yearly' ? '$19' : '$24' }}
                    <span>per seat / month</span>
                </div>
                <div class="hero-builder-seats">
                    <div class="hero-builder-seats-label">
                        <span>Seats</span>
                        <span>12 of 20</span>
                    </div>
                    <ProgressBar :value="60" :showValue="false" />
                </div>
                <div class="hero-builder-check hero-builder-toggle">
                    <label for="hb-renew">Auto-renew</label>
                    <ToggleSwitch v-model="renew" inputId="hb-renew" />
                </div>
                <Button label="Upgrade" size="small" fluid />
            </div>
        </div>

        <div class="hero-builder-foot">
            <span class="hero-builder-hint">The whole page follows your settings.</span>
            <OpenVueNuxtLink to="/theme" class="hero-builder-continue">
                <span>Continue in the Theme Builder</span>
                <i class="pi pi-arrow-right" aria-hidden="true"></i>
            </OpenVueNuxtLink>
        </div>
    </div>
</template>

<script>
import { getActiveId } from '@/service/designer/storage';
import { loadBase } from '@/service/theme/bases';
import { BASES, FONTS, isCustomColor, swatchColor } from '@/service/theme/compile';
import { DEFAULT_RECIPE, PRESETS, RADIUS_MAX, RADIUS_MIN, findPreset, isSameRecipe, normalizeRecipe, presetRecipe } from '@/service/theme/recipe';
import { readSiteTheme } from '@/service/theme/site';

const COLORS = ['noir', 'emerald', 'sky', 'blue', 'violet', 'rose', 'orange'];

const MEMBERS = [
    { name: 'Sarah Miller', email: 'sarah@studio.dev', initials: 'SM', role: 'Admin' },
    { name: 'James Carter', email: 'james@studio.dev', initials: 'JC', role: 'Pending' }
];

export default {
    data() {
        return {
            recipe: { ...DEFAULT_RECIPE },
            baseRadius: 6,
            styleCount: PRESETS.length,
            stylesOpen: false,
            members: MEMBERS,
            bases: BASES.map((base) => ({ value: base.value, label: base.value, title: base.description })),
            fonts: FONTS.map((font) => ({ value: font, label: font === 'Inter var' ? 'Inter' : font })),
            colors: COLORS,
            radiusMin: RADIUS_MIN,
            radiusMax: RADIUS_MAX,
            email: '',
            welcome: true,
            billing: 'Yearly',
            billingOptions: ['Monthly', 'Yearly'],
            renew: true
        };
    },
    created() {
        this.live = false;
        this.applyTimer = null;
    },
    mounted() {
        const worn = this.$appState.siteRecipe || (getActiveId() ? null : readSiteTheme());

        if (worn) this.recipe = normalizeRecipe(worn);
    },
    beforeUnmount() {
        if (this.applyTimer) {
            clearTimeout(this.applyTimer);
            this.$siteTheme.apply(this.recipe);
        }

        if (this.live) this.$siteTheme.setLive(false);
    },
    watch: {
        worn(value) {
            if (this.applyTimer) return;

            const next = value || DEFAULT_RECIPE;

            if (!isSameRecipe(next, this.recipe)) this.recipe = { ...next };
        },
        'recipe.base': {
            immediate: true,
            async handler(name) {
                const base = await loadBase(name);

                if (name === this.recipe.base) this.baseRadius = parseInt(base.primitive.borderRadius.md, 10) || 0;
            }
        }
    },
    methods: {
        change(changes) {
            this.recipe = normalizeRecipe({ ...this.recipe, ...changes });
            this.scheduleApply();
        },
        toggleStyles(event) {
            this.$refs.styles.toggle(event);
        },
        chooseStyle(preset) {
            this.change(presetRecipe(preset));
            this.$refs.styles.hide();
        },
        scheduleApply() {
            if (!this.live) {
                this.$siteTheme.setLive(true);
                this.live = true;
            }

            if (this.applyTimer) return;

            this.applyTimer = setTimeout(() => {
                this.applyTimer = null;
                this.$siteTheme.apply(this.recipe);
            }, 16);
        },
        swatch(color) {
            return swatchColor(color);
        },
        colorLabel(color) {
            return color === 'noir' ? 'Ink' : color.charAt(0).toUpperCase() + color.slice(1);
        }
    },
    computed: {
        worn() {
            return this.$appState.siteRecipe;
        },
        styleName() {
            return findPreset(this.recipe)?.name ?? null;
        },
        customPrimary() {
            return isCustomColor(this.recipe.primary);
        },
        radiusValue() {
            return this.recipe.radius ?? this.baseRadius;
        }
    }
};
</script>
