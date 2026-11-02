<template>
    <div class="config-panel hidden">
        <div class="config-panel-content">
            <!-- Same swatches and surface chips as the Theme Builder, so both places read alike. -->
            <div class="config-panel-settings">
                <div id="config-primary" class="config-panel-field-label">
                    <span class="config-panel-label">Primary</span>
                    <span v-if="primaryLabel" class="theme-builder-field-value">{{ primaryLabel }}</span>
                </div>
                <div class="theme-builder-swatches" role="radiogroup" aria-labelledby="config-primary">
                    <button
                        v-for="primaryColor of primaryColors"
                        :key="primaryColor.name"
                        type="button"
                        role="radio"
                        :class="['theme-builder-swatch', { 'theme-builder-swatch-active': isActivePrimary(primaryColor) }]"
                        :style="{ background: primaryColor.name === 'noir' ? 'var(--text-color)' : primaryColor.palette['500'] }"
                        :aria-label="colorName(primaryColor.name)"
                        :aria-checked="isActivePrimary(primaryColor)"
                        :title="colorName(primaryColor.name)"
                        @click="updateColors('primary', primaryColor)"
                    ></button>
                </div>
            </div>
            <div class="config-panel-settings">
                <div id="config-surface" class="config-panel-field-label">
                    <span class="config-panel-label">Surface</span>
                    <span v-if="surfaceLabel" class="theme-builder-field-value">{{ surfaceLabel }}</span>
                </div>
                <div class="theme-builder-surfaces" role="radiogroup" aria-labelledby="config-surface">
                    <button
                        v-for="surface of surfaces"
                        :key="surface.name"
                        type="button"
                        role="radio"
                        :class="['theme-builder-surface', { 'theme-builder-surface-active': isActiveSurface(surface) }]"
                        :aria-checked="isActiveSurface(surface)"
                        :title="colorName(surface.name)"
                        @click="updateColors('surface', surface)"
                    >
                        <span class="theme-builder-surface-dot" :style="{ background: `linear-gradient(135deg, ${surface.palette[200]} 50%, ${surface.palette[700]} 50%)` }" aria-hidden="true"></span>
                        <span class="theme-builder-surface-name">{{ colorName(surface.name) }}</span>
                    </button>
                </div>
            </div>
            <div class="config-panel-settings">
                <span class="config-panel-label">Theme</span>
                <SelectButton :modelValue="selectedPreset" @update:modelValue="onPresetChange" :options="presetOptions" optionLabel="label" optionValue="value" :allowEmpty="false" size="small" />
            </div>
            <div class="flex">
                <div class="flex-1">
                    <div class="config-panel-settings">
                        <span class="config-panel-label">Ripple</span>
                        <ToggleSwitch :modelValue="rippleActive" @update:modelValue="onRippleChange" />
                    </div>
                </div>
                <div class="flex-1">
                    <div class="config-panel-settings items-end">
                        <span class="config-panel-label">RTL</span>
                        <ToggleSwitch v-model="isRTL" @update:modelValue="onRTLChange" />
                    </div>
                </div>
            </div>
            <Button as="router-link" to="/theme" label="Theme Builder" icon="pi pi-arrow-right" iconPos="right" fluid @click="closePanel" />
        </div>
    </div>
</template>

<script>
import EventBus from '@/app/AppEventBus';
import { updatePreset, updateSurfacePalette } from '@openvue/themes';
import Aura from '@openvue/themes/aura';
import { PRIMARY_COLORS, SURFACES } from '@/service/theme/compile';
import { PRESET_OPTIONS, applySitePreset, loadedPresets, presetExtension, releaseSiteTheme, selectedPreset } from '@/service/theme/presets';

export default {
    data() {
        return {
            presetOptions: PRESET_OPTIONS,
            surfaces: Object.entries(SURFACES).map(([name, palette]) => ({ name, palette })),
            isRTL: false
        };
    },
    methods: {
        releaseSiteTheme() {
            releaseSiteTheme(this.$appState, this.$siteTheme);
        },
        // The panel is opened by StyleClass on the topbar button; it stays open across client-side navigation unless hidden here.
        closePanel() {
            this.$el.classList.add('hidden');
        },
        updateColors(type, color) {
            this.releaseSiteTheme();

            if (type === 'primary') {
                this.$appState.primary = color.name;
            } else if (type === 'surface') {
                this.$appState.surface = color.name;
            }

            this.applyTheme(type, color);
        },
        applyTheme(type, color) {
            if (type === 'primary') {
                updatePreset(presetExtension(this.$appState));
            } else if (type === 'surface') {
                updateSurfacePalette(color.palette);
            }

            EventBus.emit('theme-palette-change');
        },
        colorName(name) {
            return name === 'noir' ? 'Ink' : name.charAt(0).toUpperCase() + name.slice(1);
        },
        isActivePrimary(color) {
            return !this.siteThemeWorn && this.selectedPrimaryColor === color.name;
        },
        isActiveSurface(surface) {
            return !this.siteThemeWorn && (this.selectedSurfaceColor || this.defaultSurfaceColor) === surface.name;
        },
        onRippleChange(value) {
            this.$primevue.config.ripple = value;
        },
        onPresetChange(value) {
            applySitePreset(this.$appState, this.$siteTheme, value);
        },
        onRTLChange(value) {
            if (!document.startViewTransition) {
                this.toggleRTL(value);

                return;
            }

            document.startViewTransition(() => this.toggleRTL(value));
        },
        toggleRTL(value) {
            const htmlElement = document.documentElement;

            if (value) {
                htmlElement.setAttribute('dir', 'rtl');
            } else {
                htmlElement.removeAttribute('dir');
            }
        }
    },
    computed: {
        rippleActive() {
            return this.$primevue.config.ripple;
        },
        selectedPrimaryColor() {
            return this.$appState.primary;
        },
        selectedSurfaceColor() {
            return this.$appState.surface;
        },
        primaryLabel() {
            return this.siteThemeWorn ? null : this.colorName(this.selectedPrimaryColor);
        },
        surfaceLabel() {
            return this.siteThemeWorn ? null : this.colorName(this.selectedSurfaceColor || this.defaultSurfaceColor);
        },
        selectedPreset() {
            return selectedPreset(this.$appState);
        },
        siteThemeWorn() {
            return !!this.$appState.siteRecipe;
        },
        defaultSurfaceColor() {
            if (this.$appState.preset === 'Nide') return 'neutral';

            return this.$appState.darkTheme ? 'zinc' : 'slate';
        },
        primaryColors() {
            const presetPalette = (loadedPresets[this.$appState.preset] || Aura).primitive;

            return PRIMARY_COLORS.map((name) => ({ name, palette: name === 'noir' ? {} : presetPalette[name] }));
        }
    }
};
</script>
