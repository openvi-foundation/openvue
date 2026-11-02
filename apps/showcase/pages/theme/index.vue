<template>
    <div class="theme-builder">
        <AppTopBar :showDesigner="false" :showConfigurator="false" />
        <ClientOnly>
            <div class="theme-builder-workspace">
                <aside id="tb-settings" :class="['theme-builder-sidebar', { 'theme-builder-sidebar-open': settingsOpen }]" aria-label="Theme settings">
                    <div class="theme-builder-sidebar-head">
                        <div class="theme-builder-sidebar-title">
                            <h1>Theme Builder</h1>
                            <span :class="['theme-builder-badge', { 'theme-builder-badge-custom': !themeLabel }]">{{ themeLabel ?? 'Custom' }}</span>
                        </div>
                        <div class="theme-builder-sidebar-actions">
                            <button type="button" class="theme-builder-icon-button" :disabled="!canUndo" aria-label="Undo" title="Undo (Ctrl+Z)" @click="undo"><i class="pi pi-undo" aria-hidden="true"></i></button>
                            <button type="button" class="theme-builder-icon-button theme-builder-redo" :disabled="!canRedo" aria-label="Redo" title="Redo (Ctrl+Shift+Z)" @click="redo"><i class="pi pi-undo" aria-hidden="true"></i></button>
                            <button type="button" class="theme-builder-icon-button" :disabled="isDefault" aria-label="Reset to default" title="Reset to default" @click="resetTheme"><i class="pi pi-replay" aria-hidden="true"></i></button>
                            <button ref="settingsClose" type="button" class="theme-builder-icon-button theme-builder-settings-close" aria-label="Close settings" title="Close" @click="closeSettings">
                                <i class="pi pi-times" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>

                    <div class="theme-builder-sidebar-scroll">
                        <ThemeBuilderSection title="Base theme" :summary="recipe.base">
                            <ThemeBuilderChoice :modelValue="recipe.base" :options="bases" stacked ariaLabelledby="tb-section-base-theme" @update:modelValue="onChange({ base: $event })">
                                <template #option="{ option }">
                                    <span class="theme-builder-choice-label">{{ option.label }}</span>
                                    <span v-if="option.isNew" class="theme-builder-new-tag">New</span>
                                    <span class="theme-builder-choice-hint">{{ option.hint }}</span>
                                </template>
                            </ThemeBuilderChoice>
                        </ThemeBuilderSection>
                        <ThemeBuilderSection title="Presets" :summary="themeLabel ?? 'Custom'" :defaultOpen="false">
                            <ThemeStyleGrid :active="activeName" grouped @select="setRecipe(presetRecipe($event))" />
                            <p class="theme-builder-preset-note">{{ presetNote }}</p>
                        </ThemeBuilderSection>
                        <ThemeBuilderControls :recipe="recipe" :base="baseInfo" @change="onChange" />
                    </div>
                </aside>
                <div v-if="settingsOpen" class="theme-builder-backdrop" aria-hidden="true" @click="closeSettings"></div>

                <main class="theme-builder-canvas">
                    <div class="theme-builder-canvas-bar">
                        <div class="theme-builder-views" role="tablist" aria-label="Preview">
                            <button
                                v-for="option of views"
                                :key="option.value"
                                type="button"
                                role="tab"
                                :aria-selected="view === option.value"
                                :class="['theme-builder-view', { 'theme-builder-view-active': view === option.value }]"
                                @click="view = option.value"
                            >
                                <i :class="option.icon" aria-hidden="true"></i>
                                <span>{{ option.label }}</span>
                            </button>
                        </div>
                        <div class="theme-builder-canvas-actions">
                            <button ref="settingsToggle" type="button" class="theme-builder-button theme-builder-settings-toggle" aria-controls="tb-settings" :aria-expanded="settingsOpen" @click="openSettings">
                                <i class="pi pi-sliders-h" aria-hidden="true"></i>
                                <span>Customize</span>
                            </button>
                            <button type="button" class="theme-builder-button" @click="copyLink">
                                <i :class="['pi', linkCopied ? 'pi-check' : 'pi-link']" aria-hidden="true"></i>
                                <span>{{ linkCopied ? 'Copied' : 'Share' }}</span>
                            </button>
                            <button type="button" class="theme-builder-button theme-builder-button-primary" @click="exportVisible = true">
                                <i class="pi pi-download" aria-hidden="true"></i>
                                <span>Export</span>
                            </button>
                        </div>
                    </div>

                    <div class="theme-builder-stage">
                        <ThemeBuilderFamilies v-if="view === 'components'" />
                        <ThemeBuilderCards v-else-if="view === 'blocks'" />
                        <ThemeBuilderApps v-else />
                    </div>
                </main>
            </div>

            <ThemeBuilderExportDialog v-model:visible="exportVisible" :recipe="recipe" :presetName="themeLabel" :shareLink="shareLink" @designer="openDesigner" />

            <template #fallback>
                <div class="theme-builder-workspace theme-builder-workspace-loading" aria-busy="true"></div>
            </template>
        </ClientOnly>
        <Toast />
    </div>
</template>

<script>
import { encodeShare } from '@/service/designer/share';
import { getActiveId } from '@/service/designer/storage';
import { loadBase } from '@/service/theme/bases';
import { BASES, buildPresetExt } from '@/service/theme/compile';
import { toDesignerPayload } from '@/service/theme/export';
import { DEFAULT_RECIPE, PRESETS, createRecipeHistory, decodeRecipe, encodeRecipe, findPreset, isSameRecipe, normalizeRecipe, presetRecipe } from '@/service/theme/recipe';
import { readSiteTheme } from '@/service/theme/site';
import { definePreset } from '@openvue/themes';

const HEAD_ATTRIBUTE = 'data-theme-builder';

// Where the builder starts when nothing is shared or worn: the site default on Nide. DEFAULT_RECIPE stays the
// site's own look (Aura), since presets, persistence and the share link are measured against it.
const START_RECIPE = Object.freeze({ ...DEFAULT_RECIPE, base: 'Nide' });

const BASE_OPTIONS = [...BASES].sort((a, b) => (b.value === 'Nide') - (a.value === 'Nide')).map((base) => ({ value: base.value, label: base.value, hint: base.description, isNew: base.value === 'Nide' }));

export default {
    setup() {
        definePageMeta({
            layout: 'custom'
        });

        useSeo({
            title: 'Theme Builder',
            description: 'Restyle the OpenVue site with one of twelve themes or your own: structure, colours, Google Fonts typography, radius, density, focus ring, motion and depth, previewed live on every component and exported for Vue or Nuxt.',
            path: '/theme'
        });
    },
    data() {
        return {
            recipe: { ...START_RECIPE },
            bases: BASE_OPTIONS,
            view: 'components',
            views: [
                { value: 'components', label: 'Components', icon: 'pi pi-th-large' },
                { value: 'blocks', label: 'Blocks', icon: 'pi pi-clone' },
                { value: 'apps', label: 'Apps', icon: 'pi pi-desktop' }
            ],
            baseInfo: undefined,
            canUndo: false,
            canRedo: false,
            exportVisible: false,
            linkCopied: false,
            // Narrow screens only: the settings become a drawer over the preview.
            settingsOpen: false
        };
    },
    created() {
        // Kept off the reactive state: Vue proxies break cloning presets.
        this.history = createRecipeHistory();
        this.applyTimer = null;
        this.hashTimer = null;
        this.persistNext = false;
    },
    mounted() {
        this.$siteTheme.setLive(true);

        window.addEventListener('hashchange', this.onHashChange);
        window.addEventListener('keydown', this.onKeyDown);

        const shared = decodeRecipe(window.location.hash);
        const worn = this.$appState.siteRecipe || (getActiveId() ? null : readSiteTheme());

        this.setRecipe(shared || worn || START_RECIPE, { persist: !!shared });
    },
    beforeUnmount() {
        window.removeEventListener('hashchange', this.onHashChange);
        window.removeEventListener('keydown', this.onKeyDown);
        clearTimeout(this.applyTimer);
        clearTimeout(this.hashTimer);
        clearTimeout(this.linkTimer);

        if (this.applyTimer) this.$siteTheme.apply(this.recipe, { persist: this.persistNext });

        this.$siteTheme.setLive(false);
        document.querySelectorAll(`[${HEAD_ATTRIBUTE}]`).forEach((element) => element.remove());
    },
    watch: {
        'recipe.base': {
            immediate: true,
            async handler(name) {
                const base = await loadBase(name);
                const { semantic, primitive, components } = base;

                if (name !== this.recipe.base) return;

                this.baseInfo = {
                    radius: parseInt(primitive.borderRadius.md, 10) || 0,
                    disabled: Number(semantic.disabledOpacity) || 0.6,
                    focusWidth: semantic.focusRing?.width ?? '1px',
                    focusOffset: semantic.focusRing?.offset ?? '2px',
                    focusShadow: {
                        light: semantic.colorScheme?.light?.focusRing?.shadow ?? semantic.focusRing?.shadow ?? 'none',
                        dark: semantic.colorScheme?.dark?.focusRing?.shadow ?? semantic.focusRing?.shadow ?? 'none'
                    },
                    cardShadow: components.card?.root?.shadow ?? 'none',
                    motion: semantic.transitionDuration ?? '0.2s'
                };
            }
        }
    },
    methods: {
        setRecipe(next, { record = true, persist = true } = {}) {
            this.recipe = normalizeRecipe(next);

            if (record) this.history.push(this.recipe);

            this.canUndo = this.history.canUndo();
            this.canRedo = this.history.canRedo();
            this.scheduleHash();
            this.scheduleApply(persist);
        },
        // A timer rather than requestAnimationFrame, which browsers pause for occluded windows.
        scheduleApply(persist) {
            this.persistNext = this.persistNext || persist;

            if (this.applyTimer) return;

            this.applyTimer = setTimeout(() => {
                this.applyTimer = null;
                this.$siteTheme.apply(this.recipe, { persist: this.persistNext });
                this.persistNext = false;
            }, 16);
        },
        // Safari throws after ~100 URL rewrites in a few seconds, which one slider drag does.
        scheduleHash() {
            clearTimeout(this.hashTimer);
            this.hashTimer = setTimeout(this.writeHash, 250);
        },
        writeHash() {
            const url = window.location.pathname + window.location.search + (this.isDefault ? '' : '#' + encodeRecipe(this.recipe));

            this.hashTimer = null;

            try {
                window.history.replaceState(window.history.state, '', url);
            } catch {}
        },
        onHashChange() {
            const next = decodeRecipe(window.location.hash);

            if (next && !isSameRecipe(next, this.recipe)) this.setRecipe(next);
        },
        openSettings() {
            this.settingsOpen = true;
            this.$nextTick(() => this.$refs.settingsClose?.focus());
        },
        closeSettings() {
            this.settingsOpen = false;
            this.$nextTick(() => this.$refs.settingsToggle?.focus());
        },
        onKeyDown(event) {
            if (event.key === 'Escape' && this.settingsOpen) {
                this.closeSettings();

                return;
            }

            const target = event.target;
            const editing = target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
            const key = event.key.toLowerCase();

            if (editing || !(event.ctrlKey || event.metaKey) || (key !== 'z' && key !== 'y')) return;

            event.preventDefault();

            if (key === 'y' || event.shiftKey) this.redo();
            else this.undo();
        },
        presetRecipe(preset) {
            return presetRecipe(preset);
        },
        onChange(changes) {
            this.setRecipe({ ...this.recipe, ...changes });
        },
        undo() {
            const previous = this.history.undo();

            if (previous) this.setRecipe(previous, { record: false });
        },
        redo() {
            const next = this.history.redo();

            if (next) this.setRecipe(next, { record: false });
        },
        resetTheme() {
            this.setRecipe(START_RECIPE);
            this.$toast.add({ severity: 'info', summary: 'Back to the default theme', detail: 'Undo brings your theme back.', life: 3000 });
        },
        async copyLink() {
            try {
                await navigator.clipboard.writeText(this.shareLink);
                this.linkCopied = true;
                clearTimeout(this.linkTimer);
                this.linkTimer = setTimeout(() => (this.linkCopied = false), 1500);
            } catch {
                this.$toast.add({ severity: 'warn', summary: 'Could not copy', detail: 'Your browser blocked clipboard access. Copy the address bar instead.', life: 4000 });
            }
        },
        async openDesigner(name) {
            const recipe = this.recipe;
            const base = await loadBase(recipe.base);
            const compiled = definePreset(base, buildPresetExt(recipe, base));
            const token = await encodeShare(toDesignerPayload(recipe, name, base, compiled));

            this.$siteTheme.setLive(false);
            this.$siteTheme.release();
            window.location.assign('/designer#theme=' + token);
        }
    },
    computed: {
        activeName() {
            return findPreset(this.recipe)?.name ?? null;
        },
        isDefault() {
            return isSameRecipe(this.recipe, START_RECIPE);
        },
        // The starting theme is no preset, but it is not the user's own either.
        themeLabel() {
            return this.activeName ?? (this.isDefault ? START_RECIPE.base : null);
        },
        presetNote() {
            const preset = findPreset(this.recipe);

            if (preset) return preset.description;

            if (this.isDefault) return `${START_RECIPE.base} with the default settings. Pick a preset or adjust anything below.`;

            return `Your own theme. Every preset is a starting point: pick one of the ${PRESETS.length} and adjust it below.`;
        },
        shareLink() {
            // Always spelled out: a bare /theme opens the recipient's own worn theme, not this one.
            return window.location.origin + '/theme#' + encodeRecipe(this.recipe);
        }
    }
};
</script>
