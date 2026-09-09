<template>
    <div class="flex justify-between items-center gap-2">
        <span v-if="blocked" class="text-xs text-red-600 dark:text-red-400 leading-4">Unresolved token references block export. Run Check Theme in Settings.</span>
        <span v-else></span>
        <div class="flex gap-2">
            <button type="button" @click="toggleExportMenu" class="btn-design-outlined">Export</button>
            <button type="button" @click="apply" class="btn-design">Apply</button>
        </div>
        <Menu ref="exportMenu" :model="exportOptions" :popup="true" />
    </div>
</template>

<script>
import { validatePreset } from '@/service/designer/validate';

export default {
    inject: ['designerService'],
    data() {
        return {
            blocked: false,
            exportOptions: [
                {
                    label: 'TypeScript preset (.ts)',
                    icon: 'pi pi-download',
                    command: () => this.exportTheme('ts')
                },
                {
                    label: 'JavaScript preset (.js)',
                    icon: 'pi pi-download',
                    command: () => this.exportTheme('js')
                },
                {
                    label: 'Theme JSON (.json)',
                    icon: 'pi pi-file',
                    command: () => this.exportTheme('json')
                },
                {
                    separator: true
                },
                {
                    label: 'Copy share link',
                    icon: 'pi pi-link',
                    command: () => this.copyShareLink()
                }
            ]
        };
    },
    methods: {
        toggleExportMenu(event) {
            this.$refs.exportMenu.toggle(event);
        },
        /**
         * Broken references and cycles generate CSS that silently does not render, so exporting
         * one would hand the user a theme that looks broken with no explanation.
         */
        guard() {
            const basePreset = this.designerService.getBasePreset(this.$appState.designer.theme.base);
            const result = validatePreset(this.$appState.designer.theme.preset, basePreset);

            this.blocked = !result.canExport;

            if (this.blocked) {
                this.$toast.add({ severity: 'error', summary: 'Cannot export', detail: result.errorCount + ' unresolved token problem(s). Run Check Theme in Settings for details.', life: 5000 });
            }

            return result.canExport;
        },
        exportTheme(kind) {
            if (this.guard()) {
                this.designerService.exportTheme(kind);
            }
        },
        async copyShareLink() {
            if (!this.guard()) {
                return;
            }

            const link = await this.designerService.createShareLink();

            try {
                await navigator.clipboard.writeText(link);
                this.$toast.add({ severity: 'success', summary: 'Copied', detail: 'Share link copied to your clipboard.', life: 3000 });
            } catch {
                this.$toast.add({ severity: 'warn', summary: 'Could not copy', detail: 'Copy the link from the address bar instead.', life: 5000 });
            }
        },
        apply() {
            this.designerService.applyTheme(this.$appState.designer.theme);
            this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Theme saved', life: 3000 });
        }
    }
};
</script>
