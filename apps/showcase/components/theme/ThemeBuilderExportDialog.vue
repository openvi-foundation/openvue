<template>
    <Dialog :visible="visible" header="Export theme" modal :style="{ width: '56rem' }" :breakpoints="{ '960px': '95vw' }" :draggable="false" class="theme-builder-export" @update:visible="$emit('update:visible', $event)" @show="refresh">
        <div class="theme-builder-export-body">
            <div class="theme-builder-export-controls">
                <div class="theme-builder-export-field">
                    <label for="tb-export-name">Theme name</label>
                    <InputText id="tb-export-name" v-model="name" maxlength="60" placeholder="My Theme" autocomplete="off" @update:modelValue="scheduleRefresh" />
                </div>
                <div class="theme-builder-export-field">
                    <span id="tb-export-framework">Framework</span>
                    <ThemeBuilderChoice v-model="framework" :options="frameworks" ariaLabelledby="tb-export-framework" />
                </div>
            </div>

            <p class="theme-builder-export-note">
                <code>{{ files ? current.name : 'theme.js' }}</code> holds only what differs from <strong>{{ recipe.base }}</strong
                >, so it stays short and keeps receiving upstream fixes to the base.
                <template v-if="framework === 'vue'"> Add the files to a Vite project with <code>openvue</code> and <code>@openvue/themes</code> installed.</template>
                <template v-else> Add the files to a Nuxt project with <code>@openvue/nuxt-module</code> installed.</template>
                In TypeScript, name the theme file <code>.ts</code><template v-if="framework === 'nuxt'"> and update its path in <code>nuxt.config.ts</code></template
                >; the code stays the same.
            </p>

            <div class="theme-builder-export-files">
                <div class="theme-builder-export-tabs" role="tablist" aria-label="Generated files">
                    <template v-if="files">
                        <button
                            v-for="(file, index) of files[framework]"
                            :key="file.name"
                            type="button"
                            role="tab"
                            :aria-selected="fileIndex === index"
                            :class="['theme-builder-export-tab', { 'theme-builder-export-tab-active': fileIndex === index }]"
                            @click="fileIndex = index"
                        >
                            {{ file.name }}
                        </button>
                    </template>
                    <span class="theme-builder-export-tab-actions">
                        <button type="button" class="theme-builder-icon-button" :disabled="!files" :aria-label="files ? 'Copy ' + current.name : 'Copy'" title="Copy" @click="copy(current.code, current.name)">
                            <i :class="['pi', copied === current?.name ? 'pi-check' : 'pi-copy']" aria-hidden="true"></i>
                        </button>
                        <button type="button" class="theme-builder-icon-button" :disabled="!files" :aria-label="files ? 'Download ' + current.name : 'Download'" title="Download" @click="download(current)">
                            <i class="pi pi-download" aria-hidden="true"></i>
                        </button>
                    </span>
                </div>
                <pre v-if="files" class="theme-builder-export-code" tabindex="0"><code>{{ current.code }}</code></pre>
                <div v-else class="theme-builder-export-code theme-builder-export-loading">Generating…</div>
            </div>
        </div>

        <template #footer>
            <div class="theme-builder-export-footer">
                <div class="theme-builder-export-footer-group">
                    <Button label="Refine in the Theme Designer" icon="pi pi-pen-to-square" severity="secondary" outlined size="small" @click="$emit('designer', themeName)" />
                </div>
                <div class="theme-builder-export-footer-group">
                    <Button :label="copied === 'link' ? 'Link copied' : 'Copy share link'" :icon="copied === 'link' ? 'pi pi-check' : 'pi pi-link'" severity="secondary" text size="small" @click="copy(shareLink, 'link')" />
                    <Button
                        :label="copied === 'agent' ? 'Copied for your agent' : 'Copy for AI agent'"
                        :icon="copied === 'agent' ? 'pi pi-check' : 'pi pi-sparkles'"
                        severity="secondary"
                        outlined
                        size="small"
                        :disabled="!files"
                        title="A short prompt with the theme files, to paste into an AI coding agent working in your project"
                        @click="copyForAgent"
                    />
                    <Button label="Download all" icon="pi pi-download" size="small" :disabled="!files" @click="downloadAll" />
                </div>
            </div>
        </template>
    </Dialog>
</template>

<script>
import { loadBase } from '@/service/theme/bases';
import { buildPresetExt } from '@/service/theme/compile';
import { toAgentPrompt, toExportFiles } from '@/service/theme/export';
import { resolveFontUrl } from '@/service/theme/fonts';
import { isSameRecipe } from '@/service/theme/recipe';
import { definePreset } from '@openvue/themes';

export default {
    emits: ['update:visible', 'designer'],
    props: {
        visible: Boolean,
        recipe: {
            type: Object,
            required: true
        },
        presetName: {
            type: String,
            default: null
        },
        shareLink: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            name: '',
            suggestedName: '',
            framework: 'vue',
            frameworks: [
                { value: 'vue', label: 'Vite' },
                { value: 'nuxt', label: 'Nuxt' }
            ],
            fileIndex: 0,
            files: null,
            copied: null
        };
    },
    beforeUnmount() {
        clearTimeout(this.refreshTimer);
        clearTimeout(this.copiedTimer);
    },
    watch: {
        recipe() {
            if (this.visible) this.scheduleRefresh();
        },
        framework() {
            this.fileIndex = 0;
        }
    },
    methods: {
        scheduleRefresh() {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = setTimeout(this.refresh, 200);
        },
        async refresh() {
            const suggested = (this.presetName ?? 'Custom') + ' Theme';

            if (!this.name.trim() || this.name === this.suggestedName) this.name = suggested;

            this.suggestedName = suggested;

            const recipe = this.recipe;
            const [base, fontUrl] = await Promise.all([loadBase(recipe.base), resolveFontUrl(recipe.font)]);

            if (!isSameRecipe(recipe, this.recipe)) return;

            const compiled = definePreset(base, buildPresetExt(recipe, base));

            this.files = toExportFiles(recipe, this.themeName, base, compiled, { fontUrl });
        },
        async copy(text, key) {
            try {
                await navigator.clipboard.writeText(text);
                this.copied = key;
                clearTimeout(this.copiedTimer);
                this.copiedTimer = setTimeout(() => (this.copied = null), 1500);
            } catch {
                this.$toast.add({ severity: 'warn', summary: 'Could not copy', detail: 'Your browser blocked clipboard access. Select the text and copy it manually.', life: 4000 });
            }
        },
        download(file) {
            const blob = new Blob([file.code], { type: 'text/plain;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.download = file.name.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        },
        copyForAgent() {
            const prompt = toAgentPrompt(this.files[this.framework], { framework: this.framework, recipe: this.recipe, name: this.themeName });

            this.copy(prompt, 'agent');
        },
        downloadAll() {
            // Browsers drop some downloads from a burst.
            this.files[this.framework].forEach((file, index) => setTimeout(() => this.download(file), index * 150));
        }
    },
    computed: {
        themeName() {
            return this.name.trim() || (this.presetName ?? 'Custom') + ' Theme';
        },
        current() {
            return this.files ? this.files[this.framework][this.fileIndex] || this.files[this.framework][0] : null;
        }
    }
};
</script>
