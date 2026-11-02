<template>
    <div class="config-panel hidden">
        <div class="config-panel-content">
            <div class="config-panel-settings">
                <div class="config-panel-styles-head">
                    <span class="config-panel-label">Style</span>
                    <OpenVueNuxtLink to="/theme" class="theme-styles-link">Customize<i class="pi pi-arrow-right" aria-hidden="true"></i></OpenVueNuxtLink>
                </div>
                <ThemeStyleGrid :active="wornStyle" @select="applyStyle" />
            </div>
            <div class="config-panel-colors">
                <span class="config-panel-label">Primary</span>
                <div>
                    <button
                        v-for="primaryColor of primaryColors"
                        :key="primaryColor.name"
                        type="button"
                        :title="primaryColor.name"
                        @click="updateColors('primary', primaryColor)"
                        :class="{ 'active-color': !siteThemeWorn && selectedPrimaryColor === primaryColor.name }"
                        :style="{ backgroundColor: `${primaryColor.name === 'noir' ? 'var(--text-color)' : primaryColor.palette['500']}` }"
                    ></button>
                </div>
            </div>
            <div class="config-panel-colors">
                <span class="config-panel-label">Surface</span>
                <div>
                    <button
                        v-for="surface of surfaces"
                        :key="surface.name"
                        type="button"
                        :title="surface.name"
                        @click="updateColors('surface', surface)"
                        :class="{ 'active-color': !siteThemeWorn && (selectedSurfaceColor || defaultSurfaceColor) === surface.name }"
                        :style="{ backgroundColor: `${surface.palette['500']}` }"
                    ></button>
                </div>
            </div>
            <div class="config-panel-settings">
                <span class="config-panel-label">Theme</span>
                <SelectButton :modelValue="siteThemeWorn ? null : $appState.preset" @update:modelValue="onPresetChange" :options="presetOptions" optionLabel="label" optionValue="value" :allowEmpty="false" size="small" />
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
        </div>
    </div>
</template>

<script>
import EventBus from '@/app/AppEventBus';
import { $t, updatePreset, updateSurfacePalette } from '@openvue/themes';
import Aura from '@openvue/themes/aura';
import { PRIMARY_COLORS, SURFACES, primaryPalette, primaryScheme } from '@/service/theme/compile';
import { presetRecipe } from '@/service/theme/recipe';
import { wornPresetName } from '@/service/theme/site';

// Loaded on demand: each preset is close to 100 KB.
const presets = { Aura };

const presetLoaders = {
    Lara: () => import('@openvue/themes/lara'),
    Material: () => import('@openvue/themes/material'),
    Nora: () => import('@openvue/themes/nora'),
    Nide: () => import('@openvue/themes/nide')
};

async function loadPreset(name) {
    if (!presets[name] && presetLoaders[name]) {
        presets[name] = (await presetLoaders[name]()).default;
    }

    return presets[name];
}

export default {
    data() {
        return {
            presetOptions: [
                { label: 'Aura', value: 'Aura' },
                { label: 'Material', value: 'Material' },
                { label: 'Lara', value: 'Lara' },
                { label: 'Nora', value: 'Nora' },
                { label: 'Nide', value: 'Nide' }
            ],
            surfaces: Object.entries(SURFACES).map(([name, palette]) => ({ name, palette })),
            isRTL: false
        };
    },
    methods: {
        getPresetExt() {
            const base = this.$appState.preset;
            const primary = this.selectedPrimaryColor;

            document.documentElement.style.setProperty('--logo-color', primary === 'noir' ? 'var(--text-secondary-color)' : 'var(--primary-color)');

            return { semantic: { primary: primaryPalette(primary), colorScheme: primaryScheme(base, primary) } };
        },
        releaseSiteTheme() {
            if (this.$appState.siteRecipe) this.$siteTheme.release({ restoreDefault: true });
        },
        applyStyle(preset) {
            this.$siteTheme.apply(presetRecipe(preset));
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
                updatePreset(this.getPresetExt());
            } else if (type === 'surface') {
                updateSurfacePalette(color.palette);
            }

            EventBus.emit('theme-palette-change');
        },
        onRippleChange(value) {
            this.$primevue.config.ripple = value;
        },
        async onPresetChange(value) {
            this.releaseSiteTheme();
            this.$appState.preset = value;

            const preset = await loadPreset(value);

            if (this.$appState.preset !== value) return;

            const surfacePalette = this.surfaces.find((s) => s.name === this.selectedSurfaceColor)?.palette;

            $t().preset(preset).preset(this.getPresetExt()).surfacePalette(surfacePalette).use({ useDefaultOptions: true });
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
        siteThemeWorn() {
            return !!this.$appState.siteRecipe;
        },
        wornStyle() {
            return wornPresetName(this.$appState);
        },
        defaultSurfaceColor() {
            if (this.$appState.preset === 'Nide') return 'neutral';

            return this.$appState.darkTheme ? 'zinc' : 'slate';
        },
        primaryColors() {
            const presetPalette = (presets[this.$appState.preset] || Aura).primitive;

            return PRIMARY_COLORS.map((name) => ({ name, palette: name === 'noir' ? {} : presetPalette[name] }));
        }
    }
};
</script>
