<template>
    <div class="theme-builder-presets">
        <article v-for="preset of presets" :key="preset.name" :class="['theme-builder-preset', { 'theme-builder-preset-active': preset.name === activeName }]">
            <div :ref="(element) => (hosts[preset.name] = element)" :class="['theme-builder-preset-stage', scopeOf(preset)]" inert aria-hidden="true"></div>
            <Teleport v-if="stages[preset.name]" :to="stages[preset.name]">
                <div class="row">
                    <Button label="Save" size="small" />
                    <ToggleSwitch :modelValue="true" />
                </div>
                <div class="row">
                    <Checkbox :modelValue="true" binary :variant="preset.input" />
                    <RadioButton modelValue="on" value="on" :variant="preset.input" />
                    <ProgressBar :value="62" :showValue="false" class="progress" />
                </div>
            </Teleport>
            <div class="theme-builder-preset-body">
                <span class="theme-builder-preset-name" :style="{ fontFamily: stack(preset.font) }">{{ preset.name }}</span>
                <span class="theme-builder-preset-meta">{{ preset.base }} · {{ fontLabel(preset.font) }}</span>
            </div>
            <button
                type="button"
                class="theme-builder-preset-select"
                :aria-pressed="preset.name === activeName"
                :aria-label="'Use the ' + preset.name + ' theme: ' + preset.description"
                :title="preset.description"
                @click="$emit('select', recipeOf(preset))"
            ></button>
        </article>
    </div>
</template>

<script>
import { loadBase } from '@/service/theme/bases';
import { buildPresetExt, fontStack, fontStylesheetUrl } from '@/service/theme/compile';
import { PRESETS, presetRecipe } from '@/service/theme/recipe';
import { presetCss, scopeClass, scopedThemeCss, structuralCss } from '@/service/theme/scope';
import BaseStyle from '@openvue/core/base/style';
import { definePreset } from '@openvue/themes';
import ButtonStyle from 'openvue/button/style';
import CheckboxStyle from 'openvue/checkbox/style';
import ProgressBarStyle from 'openvue/progressbar/style';
import RadioButtonStyle from 'openvue/radiobutton/style';
import ToggleSwitchStyle from 'openvue/toggleswitch/style';

const STAGE_COMPONENTS = ['button', 'checkbox', 'radiobutton', 'toggleswitch', 'progressbar'];

const STAGE_LAYOUT = `
.stage { display: flex; flex-direction: column; gap: 0.625rem; }
.row { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; min-width: 0; }
.row > * { flex-shrink: 0; }
.row > .progress { flex: 1 1 auto; min-width: 0; height: 0.3125rem; }
button, input { margin: 0; font: inherit; color: inherit; }
*, *::before, *::after { transition: none !important; }
`;

const HEAD_ATTRIBUTE = 'data-theme-builder';

export default {
    emits: ['select'],
    props: {
        activeName: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            presets: PRESETS,
            stages: {}
        };
    },
    created() {
        this.hosts = {};
    },
    mounted() {
        this.style = document.createElement('style');
        this.style.setAttribute(HEAD_ATTRIBUTE, '');
        document.head.appendChild(this.style);

        for (const font of new Set(PRESETS.map((preset) => preset.font))) {
            if (font === 'Inter var') continue;

            const link = document.createElement('link');

            link.rel = 'stylesheet';
            link.href = fontStylesheetUrl(font);
            link.setAttribute(HEAD_ATTRIBUTE, '');
            document.head.appendChild(link);
        }

        this.attachStages();
        this.render();
    },
    beforeUnmount() {
        this.style?.remove();
    },
    methods: {
        // Shadow roots keep the site base preset's global component CSS out of the cards.
        attachStages() {
            const shared = new CSSStyleSheet();
            const stages = {};

            shared.replaceSync(structuralCss([BaseStyle, ButtonStyle, CheckboxStyle, RadioButtonStyle, ToggleSwitchStyle, ProgressBarStyle]) + STAGE_LAYOUT);
            this.sheets = {};

            for (const preset of PRESETS) {
                const host = this.hosts[preset.name];
                const root = host.shadowRoot || host.attachShadow({ mode: 'open' });
                const stage = document.createElement('div');

                this.sheets[preset.name] = new CSSStyleSheet();
                root.adoptedStyleSheets = [shared, this.sheets[preset.name]];
                root.replaceChildren(stage);
                stage.className = 'stage';
                stages[preset.name] = stage;
            }

            this.stages = stages;
        },
        async render() {
            const blocks = await Promise.all(
                PRESETS.map(async (preset) => {
                    const recipe = presetRecipe(preset);
                    const base = await loadBase(recipe.base);
                    const compiled = definePreset(base, buildPresetExt(recipe, base));

                    this.sheets[preset.name]?.replaceSync(presetCss(compiled, STAGE_COMPONENTS));

                    return scopedThemeCss(compiled, '.' + scopeClass(preset.name), { components: STAGE_COMPONENTS, fontFamily: fontStack(recipe.font), css: false });
                })
            );

            if (this.style) this.style.textContent = blocks.join('\n');
        },
        scopeOf(preset) {
            return scopeClass(preset.name);
        },
        recipeOf(preset) {
            return presetRecipe(preset);
        },
        stack(font) {
            return fontStack(font);
        },
        fontLabel(font) {
            return font === 'Inter var' ? 'Inter' : font;
        }
    }
};
</script>
