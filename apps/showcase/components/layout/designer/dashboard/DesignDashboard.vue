<template>
    <div class="mb-6">
        <span class="block leading-6 mb-4">
            Design your own theme with a visual editor and export it as ready-to-use code. Themes are stored locally in this browser — there is no account, no license key, and nothing is uploaded.
        </span>
        <span class="block text-muted-color leading-6">Export a theme to keep a copy, or share it as a link. Clearing site data removes locally stored themes.</span>
    </div>

    <div class="flex justify-between items-center mb-2">
        <span class="text-lg font-semibold">My Themes</span>
        <FileUpload mode="basic" accept="application/json,.json" :auto="false" :customUpload="true" chooseLabel="Import" pt:root:class="!p-0" @select="onImportSelect($event)" />
    </div>
    <span class="block text-muted-color leading-6 mb-4">Continue editing an existing theme or build a new one.</span>

    <div class="flex flex-wrap gap-4">
        <button type="button" class="rounded-xl h-32 w-32 bg-transparent border border-surface-200 dark:border-surface-700 text-black dark:text-white hover:border-surface-400 dark:hover:border-surface-500" @click="openNewTheme">
            <i class="pi pi-plus"></i>
        </button>
        <div v-for="theme of $appState.designer.themes" :key="theme.id" class="flex flex-col gap-2 relative">
            <button
                type="button"
                class="relative rounded-xl h-32 w-32 px-4 overflow-hidden text-ellipsis bg-transparent border border-surface-200 dark:border-surface-700 hover:border-surface-400 dark:hover:border-surface-500 text-black dark:text-white"
                @click="loadTheme(theme)"
            >
                <span class="text-2xl uppercase font-bold">{{ abbrThemeName(theme) }}</span>
                <span class="absolute bottom-2 start-0 text-xs text-muted-color ms-start w-full">{{ theme.base }}</span>
            </button>
            <div class="flex flex-col items-center gap-1">
                <div class="group flex items-center gap-2 relative">
                    <input
                        v-model="theme.name"
                        type="text"
                        :class="['w-24 text-sm px-2 text-center pr-4t', { 'bg-red-50 dark:bg-red-500/30': !theme.name, 'bg-transparent': theme.name }]"
                        maxlength="100"
                        @blur="renameTheme(theme)"
                        @keydown.enter="onThemeNameEnterKey($event)"
                        @keydown.escape="onThemeNameEscape($event)"
                    />
                    <i class="hidden group-hover:block pi pi-pencil !text-xs absolute top-50 text-muted-color" style="right: 2px"></i>
                </div>
                <span class="text-muted-color text-xs">{{ formatTimestamp(theme.updatedAt) }}</span>
            </div>
            <button type="button" @click="toggleMenuOptions($event, theme)" class="hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500 dark:text-surface-400 flex absolute top-1 right-1 w-8 h-8 rounded-lg items-center justify-center">
                <i class="pi pi-ellipsis-h !text-xs" />
            </button>
        </div>
        <Menu ref="themeMenu" :model="themeOptions" :popup="true" @show="onMenuShow" @hide="onMenuHide" />
    </div>
</template>

<script>
export default {
    scrollListener: null,
    inject: ['designerService'],
    data() {
        return {
            currentTheme: null,
            themeOptions: [
                {
                    label: 'Duplicate',
                    icon: 'pi pi-copy',
                    command: () => {
                        this.designerService.duplicateTheme(this.currentTheme);
                    }
                },
                {
                    label: 'Delete',
                    icon: 'pi pi-times',
                    command: () => {
                        this.$confirm.require({
                            group: 'designer',
                            message: 'Are you sure you want to delete this theme? This cannot be undone.',
                            header: 'Confirmation',
                            icon: 'pi pi-exclamation-triangle',
                            acceptProps: {
                                severity: 'danger'
                            },
                            rejectProps: {
                                severity: 'secondary'
                            },
                            accept: () => {
                                this.designerService.deleteTheme(this.currentTheme);
                            }
                        });
                    }
                }
            ]
        };
    },
    created() {
        this.designerService.listThemes();
    },
    beforeUnmount() {
        this.unbindScrollListener();
    },
    methods: {
        openNewTheme() {
            this.$appState.designer.activeView = 'create_theme';
        },
        loadTheme(theme) {
            if (this.designerService.loadTheme(theme.id)) {
                this.$appState.designer.activeTab = '0';
                this.$appState.designer.activeView = 'editor';
            }
        },
        renameTheme(theme) {
            if (theme.name && theme.name.trim().length) {
                this.designerService.renameTheme(theme, theme.name.trim());
            } else {
                this.designerService.listThemes();
            }
        },
        onImportSelect(event) {
            const file = event.files && event.files[0];

            if (!file) {
                return;
            }

            const reader = new FileReader();

            reader.onload = (e) => {
                this.designerService.importTheme(e.target.result);
            };

            reader.onerror = () => {
                this.$toast.add({ severity: 'error', summary: 'Import failed', detail: 'Unable to read the file.', life: 3000 });
            };

            reader.readAsText(file);
        },
        onThemeNameEnterKey(event) {
            event.target.blur();
        },
        onThemeNameEscape(event) {
            event.target.blur();
            event.stopPropagation();
        },
        formatTimestamp(timestamp) {
            if (!timestamp) {
                return '';
            }

            const date = new Date(timestamp);
            const options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            };

            return date.toLocaleString('en-US', options);
        },
        toggleMenuOptions(event, theme) {
            this.currentTheme = theme;
            this.$refs.themeMenu.toggle(event);
        },
        onMenuShow() {
            this.bindScrollListener();
        },
        onMenuHide() {
            this.unbindScrollListener();
        },
        bindScrollListener() {
            if (!this.scrollListener) {
                this.scrollListener = () => {
                    this.$refs.themeMenu.hide();
                };

                window.addEventListener('scroll', this.scrollListener);
            }
        },
        unbindScrollListener() {
            if (this.scrollListener) {
                window.removeEventListener('scroll', this.scrollListener);
                this.scrollListener = null;
            }
        },
        abbrThemeName(theme) {
            return theme.name ? theme.name.substring(0, 2) : 'UT';
        }
    }
};
</script>
