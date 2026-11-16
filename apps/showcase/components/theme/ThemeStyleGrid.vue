<template>
    <div ref="grid" :class="{ 'theme-styles-groups': grouped }" role="group" aria-label="Styles">
        <div v-for="group of groups" :key="group.base ?? 'all'" :class="{ 'theme-styles-group': grouped }">
            <div v-if="grouped" class="theme-styles-group-title">{{ group.base }}</div>
            <div class="theme-styles">
                <button
                    v-for="preset of group.presets"
                    :key="preset.name"
                    type="button"
                    :class="['theme-styles-tile', { 'theme-styles-tile-active': preset.name === active }]"
                    :aria-pressed="preset.name === active"
                    :title="preset.description"
                    @click="$emit('select', preset)"
                >
                    <span class="theme-builder-dot" :style="{ background: swatch(preset.primary) }" aria-hidden="true"></span>
                    <span class="theme-styles-tile-text">
                        <span class="theme-styles-tile-name" :style="{ fontFamily: stack(preset.font) }">{{ preset.name }}</span>
                        <span class="theme-styles-tile-meta">{{ grouped ? fontLabel(preset.font) : preset.base + ' · ' + fontLabel(preset.font) }}</span>
                    </span>
                    <i v-if="preset.name === active" class="pi pi-check" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { BASES, fontStack, fontStylesheetUrl, swatchColor } from '@/service/theme/compile';
import { PRESETS } from '@/service/theme/recipe';

export default {
    emits: ['select'],
    props: {
        active: {
            type: String,
            default: null
        },
        // One block per base theme, Nide first to match the builder's Base theme list.
        grouped: Boolean
    },
    data() {
        return {
            presets: PRESETS
        };
    },
    computed: {
        groups() {
            if (!this.grouped) return [{ base: null, presets: PRESETS }];

            return [...BASES]
                .sort((a, b) => (b.value === 'Nide') - (a.value === 'Nide'))
                .map((base) => ({ base: base.value, presets: PRESETS.filter((preset) => preset.base === base.value) }))
                .filter((group) => group.presets.length);
        }
    },
    mounted() {
        // The configurator keeps the grid mounted while hidden, so fonts wait until it is on screen.
        if (typeof IntersectionObserver === 'undefined') {
            this.loadFonts();

            return;
        }

        this.observer = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                this.loadFonts();
                this.observer.disconnect();
            }
        });
        this.observer.observe(this.$refs.grid);
    },
    beforeUnmount() {
        this.observer?.disconnect();
    },
    methods: {
        loadFonts() {
            for (const font of new Set(PRESETS.map((preset) => preset.font))) {
                if (font === 'Inter var' || document.head.querySelector(`link[data-style-font="${font}"]`)) continue;

                const link = document.createElement('link');

                link.rel = 'stylesheet';
                link.href = fontStylesheetUrl(font);
                link.setAttribute('data-style-font', font);
                document.head.appendChild(link);
            }
        },
        swatch(color) {
            return swatchColor(color);
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
