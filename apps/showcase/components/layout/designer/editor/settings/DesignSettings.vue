<template>
    <section>
        <div class="text-lg font-semibold mb-2">Font</div>
        <span class="block text-muted-color leading-6 mb-4">Preview only. Typography is not part of the generated theme — the export includes a comment telling you how to apply it in your own app.</span>

        <div class="flex gap-4">
            <div>
                <div class="text-sm mb-1 font-semibold text-surface-950 dark:text-surface-0">Base</div>
                <select v-model="$appState.designer.theme.config.font_size" @change="changeBaseFontSize" class="appearance-none px-3 py-2 rounded-md border border-surface-300 dark:border-surface-700 w-20">
                    <option v-for="fontSize of fontSizes" :key="fontSize" :value="fontSize">{{ fontSize }}</option>
                </select>
            </div>

            <div>
                <div class="text-sm mb-1 font-semibold text-surface-950 dark:text-surface-0">Family</div>
                <select v-model="$appState.designer.theme.config.font_family" @change="changeFont" class="appearance-none px-3 py-2 rounded-md border border-surface-300 dark:border-surface-700 w-48">
                    <option v-for="font of fonts" :key="font" :value="font">{{ font }}</option>
                </select>
            </div>
        </div>
    </section>

    <section class="mt-6">
        <div class="block text-lg font-semibold mb-2">Validation</div>
        <span class="block text-muted-color leading-6 mb-4">Unresolved references and reference cycles produce CSS that will not render, so they block export. Everything else is advisory.</span>
        <button type="button" @click="runValidation" class="btn-design-outlined">Check Theme</button>

        <div v-if="validation" class="mt-4">
            <div v-if="validation.issues.length === 0" class="p-3 bg-green-100 text-green-950 dark:bg-green-500/30 dark:text-white font-medium rounded-md leading-normal">No problems found.</div>
            <div v-else>
                <div :class="['p-3 font-medium rounded-md leading-normal', validation.errorCount ? 'bg-red-100 text-red-950 dark:bg-red-500/30 dark:text-red-100' : 'bg-yellow-100 text-yellow-950 dark:bg-yellow-500/30 dark:text-yellow-100']">
                    {{ validation.errorCount }} blocking {{ validation.errorCount === 1 ? 'problem' : 'problems' }}, {{ validation.warningCount }} {{ validation.warningCount === 1 ? 'warning' : 'warnings' }}.
                </div>
                <div class="max-h-60 overflow-auto mt-4 px-3 py-2 rounded-md border border-surface-300 dark:border-surface-700 w-full">
                    <ul class="flex flex-col gap-2">
                        <li v-for="(issue, index) of validation.issues" :key="index" class="flex flex-col gap-1">
                            <div class="flex justify-between items-center gap-2">
                                <span class="text-sm font-medium break-all">{{ issue.path || '—' }}</span>
                                <span :class="['rounded-full px-2 text-xs inline-flex items-center font-medium shrink-0', issue.severity === 'error' ? 'bg-red-600 text-white' : 'bg-yellow-500 text-black']">{{ issue.severity }}</span>
                            </div>
                            <span class="text-xs text-muted-color leading-5">{{ issue.message }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <section class="mt-6">
        <div class="block text-lg font-semibold mb-2">Migration Assistant</div>
        <span class="block text-muted-color leading-6 mb-4">
            Adds tokens introduced since this theme was created, comparing against the current {{ $appState.designer.theme.base }} preset. It never changes a value you already set. Runs entirely in your browser.
        </span>
        <div class="flex justify-start gap-2">
            <button type="button" @click="preview" class="btn-design-outlined">Check for Updates</button>
            <button v-if="status === 'preview' && missingTokens.length > 0" type="button" @click="confirmMigration" class="btn-design">Migrate</button>
        </div>
        <div v-if="status === 'preview'">
            <div v-if="missingTokens.length" class="p-3 bg-yellow-100 text-yellow-950 dark:bg-yellow-500/30 dark:text-yellow-100 font-medium mt-4 rounded-md leading-normal">
                There are missing tokens. Migrating adds them with the base theme's values, which you can then adjust in the corresponding section.
            </div>
            <div v-else class="p-3 bg-green-100 text-green-950 dark:bg-green-500/30 dark:text-white font-medium mt-4 rounded-md leading-normal">Your theme is up to date.</div>
        </div>
        <div v-else-if="status === 'updated'">
            <div class="p-3 bg-green-100 text-green-950 dark:bg-green-500/30 dark:text-white font-medium mt-4 rounded-md leading-normal">Your theme is successfully updated.</div>
        </div>

        <div v-if="missingTokens.length" class="max-h-60 overflow-auto mt-4 px-3 py-2 rounded-md border border-surface-300 dark:border-surface-700 w-full">
            <ul class="flex flex-col gap-1">
                <li v-for="token of missingTokens" :key="token.value" class="flex justify-between gap-2">
                    <span class="bg-red-50 text-red-950 dark:bg-red-500/30 dark:text-red-100 text-sm font-medium px-2 py-1 rounded-lg break-all">{{ token.value }}</span>
                    <span class="bg-zinc-950 text-white dark:bg-white dark:text-black rounded-full px-2 text-xs inline-flex items-center font-medium shrink-0">{{ token.type }}</span>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
import { applyMissingTokens, findMissingTokens } from '@/service/designer/compat';
import { validatePreset } from '@/service/designer/validate';

export default {
    inject: ['designerService'],
    data() {
        return {
            missingTokens: [],
            status: null,
            validation: null,
            fontSizes: ['12px', '13px', '14px', '15px', '16px'],
            fonts: [
                'DM Sans',
                'Dosis',
                'Figtree',
                'IBM Plex Sans',
                'Inter var',
                'Lato',
                'Lexend',
                'Merriweather Sans',
                'Montserrat',
                'Noto Sans Display',
                'Nunito',
                'Nunito Sans',
                'Onest',
                'Open Sans',
                'Outfit',
                'Poppins',
                'PT Sans',
                'Public Sans',
                'Quicksand',
                'Raleway',
                'Roboto',
                'Source Sans Pro',
                'Space Grotesk',
                'Spline Sans',
                'Titillium Web',
                'Ubuntu Sans'
            ]
        };
    },
    methods: {
        changeFont() {
            this.designerService.applyFont(this.$appState.designer.theme.config.font_family);
            this.designerService.saveTheme(this.$appState.designer.theme);
        },
        changeBaseFontSize() {
            document.documentElement.style.fontSize = this.$appState.designer.theme.config.font_size;
            this.designerService.saveTheme(this.$appState.designer.theme);
        },
        runValidation() {
            const basePreset = this.designerService.getBasePreset(this.$appState.designer.theme.base);

            this.validation = validatePreset(this.$appState.designer.theme.preset, basePreset);
        },
        preview() {
            const basePreset = this.designerService.getBasePreset(this.$appState.designer.theme.base);

            this.missingTokens = findMissingTokens(basePreset, this.$appState.designer.theme.preset);
            this.status = 'preview';
        },
        confirmMigration() {
            this.$confirm.require({
                group: 'designer',
                message: 'Add ' + this.missingTokens.length + ' missing token(s) to this theme?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                acceptProps: {
                    severity: 'contrast'
                },
                rejectProps: {
                    severity: 'secondary'
                },
                accept: () => {
                    this.migrate();
                }
            });
        },
        migrate() {
            const basePreset = this.designerService.getBasePreset(this.$appState.designer.theme.base);
            const { preset } = applyMissingTokens(basePreset, this.$appState.designer.theme.preset);

            this.$appState.designer.theme.preset = preset;
            this.designerService.applyTheme(this.$appState.designer.theme);

            this.status = 'updated';
            this.missingTokens = [];
        }
    }
};
</script>
