<template>
    <Drawer v-model:visible="$appState.designer.active" position="right" class="designer" :modal="false" :dismissable="false" @after-show="onShow" @after-hide="onHide">
        <template #container="{ closeCallback }">
            <div class="flex items-center justify-between p-5">
                <div class="flex items-center gap-2">
                    <button v-if="$appState.designer.activeView !== 'dashboard'" type="button" @click="openDashboard" class="icon-btn">
                        <i class="pi pi-chevron-left" />
                    </button>
                    <span class="font-bold text-xl">{{ viewTitle }}</span>
                </div>
                <div class="flex items-center gap-2">
                    <button v-if="$appState.designer.activeView === 'editor'" type="button" @click="undo" :disabled="!canUndo" class="icon-btn disabled:opacity-40" title="Undo (Ctrl+Z)">
                        <i class="pi pi-undo" />
                    </button>
                    <button v-if="$appState.designer.activeView === 'editor'" type="button" @click="redo" :disabled="!canRedo" class="icon-btn disabled:opacity-40" title="Redo (Ctrl+Shift+Z)">
                        <i class="pi pi-refresh" />
                    </button>
                    <button type="button" @click="toggleDarkMode" class="icon-btn">
                        <i :class="['pi', { 'pi-moon': $appState.darkTheme, 'pi-sun': !$appState.darkTheme }]"></i>
                    </button>
                    <button type="button" @click="closeCallback" class="icon-btn">
                        <i class="pi pi-times" />
                    </button>
                </div>
            </div>

            <div class="flex-auto overflow-auto pb-5 px-5">
                <DesignDashboard v-if="$appState.designer.activeView === 'dashboard'" />
                <DesignCreateTheme v-else-if="$appState.designer.activeView === 'create_theme'" />
                <DesignEditor v-else-if="$appState.designer.activeView === 'editor'" :deferred="deferredTabs" />
            </div>

            <div class="p-5">
                <DesignEditorFooter v-if="$appState.designer.activeView === 'editor'" />
            </div>
        </template>
    </Drawer>
    <ConfirmDialog group="designer"></ConfirmDialog>
</template>

<script>
import EventBus from '@/app/AppEventBus';
import { $dt, definePreset, usePreset } from '@openvue/themes';
import Aura from '@openvue/themes/aura';
import Lara from '@openvue/themes/lara';
import Material from '@openvue/themes/material';
import Nora from '@openvue/themes/nora';
import { toFileName, toPresetSource, toThemeJson } from '@/service/designer/codegen';
import { deepDiff, findRemovedPaths, isEqual } from '@/service/designer/diff';
import { SCHEMA_VERSION, THEME_FORMAT, cloneDocument, clonePlain, createDocument } from '@/service/designer/document';
import { createHistory } from '@/service/designer/history';
import { importThemeJson, importThemeObject } from '@/service/designer/importer';
import { getPath, setPath } from '@/service/designer/path';
import { encodeShare, decodeShare, applySharedRemovals } from '@/service/designer/share';
import * as storage from '@/service/designer/storage';

const basePresets = { Aura, Lara, Material, Nora };

export default {
    provide() {
        return {
            designerService: {
                refreshACTokens: this.refreshACTokens,
                saveTheme: this.saveTheme,
                activateTheme: this.activateTheme,
                applyTheme: this.applyTheme,
                applyFont: this.applyFont,
                resolveColor: this.resolveColor,
                resolveColorPlain: this.resolveColorPlain,
                createTheme: this.createTheme,
                exportTheme: this.exportTheme,
                importTheme: this.importTheme,
                deleteTheme: this.deleteTheme,
                duplicateTheme: this.duplicateTheme,
                renameTheme: this.renameTheme,
                listThemes: this.listThemes,
                loadTheme: this.loadTheme,
                getBasePreset: this.getBasePreset,
                recordEdit: this.recordEdit,
                createShareLink: this.createShareLink
            }
        };
    },
    data() {
        return {
            deferredTabs: true,
            canUndo: false,
            canRedo: false
        };
    },
    created() {
        this.history = createHistory();
    },
    async mounted() {
        this.$appState.designer.themes = storage.listThemes();

        window.addEventListener('keydown', this.onGlobalKeyDown);

        // A shared link wins over whatever was last open locally — the user followed it on purpose.
        if (await this.restoreFromHash()) {
            return;
        }

        const activeId = storage.getActiveId();

        if (activeId) {
            const doc = storage.loadTheme(activeId);

            if (doc) {
                this.activateTheme(doc, { apply: true });
                this.$appState.designer.activeView = 'editor';
            }
        }
    },
    beforeUnmount() {
        window.removeEventListener('keydown', this.onGlobalKeyDown);
    },
    methods: {
        onShow() {
            this.deferredTabs = false;
        },
        onHide() {
            this.deferredTabs = true;
        },
        getBasePreset(name) {
            return basePresets[name] || Aura;
        },
        listThemes() {
            this.$appState.designer.themes = storage.listThemes();

            return this.$appState.designer.themes;
        },
        createTheme({ name, base }) {
            const doc = createDocument({ name, base, preset: basePresets[base] || Aura });

            this.persist(doc);
            this.activateTheme(doc, { apply: true });
            this.history.clear();
            this.syncHistoryState();

            return doc;
        },
        loadTheme(id) {
            const doc = storage.loadTheme(id);

            if (doc) {
                this.activateTheme(doc, { apply: true });
                this.history.clear();
                this.syncHistoryState();
            }

            return doc;
        },
        duplicateTheme(doc) {
            const copy = cloneDocument(doc);

            this.persist(copy);
            this.listThemes();

            return copy;
        },
        renameTheme(doc, name) {
            const stored = storage.loadTheme(doc.id);

            if (stored) {
                stored.name = name;
                this.persist(stored);

                if (this.$appState.designer.theme.id === doc.id) {
                    this.$appState.designer.theme.name = name;
                }
            }

            this.listThemes();
        },
        deleteTheme(doc) {
            storage.deleteTheme(doc.id);

            if (this.$appState.designer.theme.id === doc.id) {
                this.$appState.designer.theme = { id: null, name: null, base: null, preset: null, config: null };
                this.$appState.designer.activeView = 'dashboard';
            }

            this.listThemes();
        },
        /**
         * Persist a document, surfacing storage failures rather than losing work silently.
         */
        persist(doc) {
            const result = storage.saveTheme(doc);

            if (!result.ok) {
                const detail = result.reason === 'quota' ? 'Local storage is full. Export this theme to keep it, then delete an old one.' : 'Local storage is unavailable, so changes are kept only for this session. Export to keep them.';

                this.$toast.add({ severity: 'warn', summary: 'Could not save locally', detail, life: 6000 });
            }

            return result;
        },
        saveTheme(theme) {
            const doc = theme || this.$appState.designer.theme;

            if (doc && doc.id) {
                this.persist(this.toPlainDocument(doc));
            }
        },
        /**
         * Strip Vue reactivity before the document leaves the component. The live theme lives in
         * `$appState`, so its preset is a reactive proxy, and both `structuredClone` and
         * IndexedDB-style serialization reject proxies outright.
         */
        toPlainDocument(doc) {
            return clonePlain({
                format: doc.format,
                schemaVersion: doc.schemaVersion,
                id: doc.id,
                name: doc.name,
                base: doc.base,
                preset: doc.preset,
                config: doc.config,
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt
            });
        },
        applyTheme(theme) {
            const doc = theme || this.$appState.designer.theme;

            this.saveTheme(doc);
            this.refreshACTokens();
            usePreset(doc.preset);
            EventBus.emit('theme-palette-change');
        },
        activateTheme(doc, { apply = true } = {}) {
            this.$appState.designer.theme = {
                format: doc.format,
                schemaVersion: doc.schemaVersion,
                id: doc.id,
                name: doc.name,
                base: doc.base,
                preset: typeof doc.preset === 'string' ? JSON.parse(doc.preset) : clonePlain(doc.preset),
                config: { ...doc.config },
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt
            };

            storage.setActiveId(doc.id);

            if (apply) {
                usePreset(this.$appState.designer.theme.preset);
            }

            this.applyFont(this.$appState.designer.theme.config.font_family);
            document.documentElement.style.fontSize = this.$appState.designer.theme.config.font_size;
            this.refreshACTokens();
        },
        importTheme(text) {
            const result = importThemeJson(text);

            if (!result.ok) {
                this.$toast.add({ severity: 'error', summary: 'Import failed', detail: result.message, life: 5000 });

                return result;
            }

            this.persist(result.document);
            this.listThemes();

            if (!result.validation.canExport) {
                this.$toast.add({ severity: 'warn', summary: 'Imported with problems', detail: 'This theme has unresolved token references. Check the editor before exporting.', life: 6000 });
            } else {
                this.$toast.add({ severity: 'success', summary: 'Imported', detail: result.document.name + ' is now in your themes.', life: 3000 });
            }

            return result;
        },
        /**
         * Generate a theme file and hand it to the browser. Everything is produced locally —
         * there is no service to call and nothing leaves the page.
         */
        exportTheme(kind, { mode = 'diff' } = {}) {
            const doc = this.toPlainDocument(this.$appState.designer.theme);
            const basePreset = this.getBasePreset(doc.base);
            const content = kind === 'json' ? toThemeJson(doc, this.libraryVersion) : toPresetSource(doc, { mode, language: kind, basePreset });
            const mime = kind === 'json' ? 'application/json' : 'text/plain';

            this.downloadFile(toFileName(doc, kind), content, mime);
        },
        downloadFile(fileName, content, mime) {
            const blob = new Blob([content], { type: mime + ';charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        },
        /**
         * Build a share link. Only the diff against the base preset travels, and it rides in the
         * URL fragment, which browsers never send to the server.
         */
        async createShareLink() {
            const doc = this.toPlainDocument(this.$appState.designer.theme);
            const basePreset = this.getBasePreset(doc.base);
            const token = await encodeShare({
                name: doc.name,
                base: doc.base,
                diff: deepDiff(basePreset, doc.preset),
                removed: findRemovedPaths(basePreset, doc.preset),
                config: doc.config
            });

            return window.location.origin + '/designer#theme=' + token;
        },
        /**
         * Restore a theme handed over in the URL fragment. The payload is a diff, so it is
         * re-merged onto whichever base preset it names.
         */
        async restoreFromHash() {
            const hash = window.location.hash || '';
            const marker = '#theme=';

            if (!hash.startsWith(marker)) {
                return false;
            }

            const result = await decodeShare(hash.slice(marker.length));

            if (!result.ok) {
                this.$toast.add({ severity: 'error', summary: 'Share link failed', detail: result.message, life: 5000 });

                return false;
            }

            const { name, base, diff, removed, config } = result.payload;
            const imported = importThemeObject({
                format: THEME_FORMAT,
                schemaVersion: SCHEMA_VERSION,
                name: typeof name === 'string' ? name : 'Shared Theme',
                base: typeof base === 'string' ? base : 'Aura',
                preset: applySharedRemovals(definePreset(this.getBasePreset(base), diff || {}), removed),
                config: config || undefined
            });

            if (!imported.ok) {
                this.$toast.add({ severity: 'error', summary: 'Share link failed', detail: imported.message, life: 5000 });

                return false;
            }

            // Persist before clearing the fragment: the link is the only copy until this lands.
            this.persist(imported.document);
            this.listThemes();
            this.activateTheme(imported.document, { apply: true });
            this.$appState.designer.activeView = 'editor';
            this.$appState.designer.active = true;
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
            this.$toast.add({ severity: 'success', summary: 'Theme loaded', detail: imported.document.name + ' was restored from the link.', life: 3000 });

            return true;
        },
        recordEdit(path) {
            const before = clonePlain(getPath(this.$appState.designer.theme.preset, path));

            return (after) => {
                if (isEqual(before, after)) return;

                this.history.push({ path, before, after: clonePlain(after) });
                this.syncHistoryState();
            };
        },
        onGlobalKeyDown(event) {
            if (!this.$appState.designer.active || this.$appState.designer.activeView !== 'editor') {
                return;
            }

            const modifier = event.ctrlKey || event.metaKey;

            if (modifier && event.key.toLowerCase() === 'z') {
                event.preventDefault();

                if (event.shiftKey) {
                    this.redo();
                } else {
                    this.undo();
                }
            }
        },
        undo() {
            const patch = this.history.undo();

            if (patch) {
                setPath(this.$appState.designer.theme.preset, patch.path, patch.before);
                this.applyTheme();
                this.syncHistoryState();
            }
        },
        redo() {
            const patch = this.history.redo();

            if (patch) {
                setPath(this.$appState.designer.theme.preset, patch.path, patch.after);
                this.applyTheme();
                this.syncHistoryState();
            }
        },
        syncHistoryState() {
            this.canUndo = this.history.canUndo();
            this.canRedo = this.history.canRedo();
        },
        camelCaseToDotCase(name) {
            return name
                .replace(/([a-z])([A-Z])/g, '$1.$2')
                .replace(/([a-zA-Z])(\d)/g, '$1.$2')
                .toLowerCase();
        },
        generateACTokens(parentPath, obj) {
            for (let key in obj) {
                if (key === 'dark' || key === 'components' || key === 'directives') {
                    continue;
                }

                if (key === 'primitive' || key === 'semantic' || key === 'colorScheme' || key === 'light' || key === 'extend') {
                    this.generateACTokens(null, obj[key]);
                } else {
                    if (typeof obj[key] === 'object') {
                        this.generateACTokens(parentPath ? parentPath + '.' + key : key, obj[key]);
                    } else {
                        const regex = /\.\d+$/;

                        const tokenName = this.camelCaseToDotCase(parentPath ? parentPath + '.' + key : key);
                        const tokenValue = obj[key];
                        // Guard the string checks: numeric token values (font weights, opacities)
                        // reach this branch too and have no startsWith.
                        const isString = typeof tokenValue === 'string';
                        const isColor =
                            tokenName.includes('color') ||
                            tokenName.includes('background') ||
                            regex.test(tokenName) ||
                            (isString && (tokenValue.startsWith('#') || tokenValue.startsWith('rgb') || tokenValue.startsWith('hsl') || tokenValue.startsWith('oklch')));

                        this.$appState.designer.acTokens.push({ token: tokenName, label: '{' + tokenName + '}', variable: $dt(tokenName).variable, value: tokenValue, isColor: isColor });
                    }
                }
            }
        },
        refreshACTokens() {
            this.$appState.designer.acTokens = [];

            if (this.$appState.designer.theme.preset) {
                this.generateACTokens(null, this.$appState.designer.theme.preset);
            }
        },
        openDashboard() {
            this.$appState.designer.activeView = 'dashboard';
        },
        applyFont(fontFamily) {
            if (fontFamily !== 'Inter var') {
                this.loadFont(fontFamily, 400);
                this.loadFont(fontFamily, 500);
                this.loadFont(fontFamily, 600);
                this.loadFont(fontFamily, 700);
            } else {
                document.body.style.fontFamily = `"Inter var", sans-serif`;
            }
        },
        async loadFont(fontFamily, weight) {
            try {
                const fontFamilyPath = fontFamily.toLowerCase().replace(/\s+/g, '-');
                const fontUrl = `https://fonts.bunny.net/${fontFamilyPath}/files/${fontFamilyPath}-latin-${weight}-normal.woff2`;
                const font = new FontFace(fontFamily, `url(${fontUrl})`, {
                    weight: weight.toString(),
                    style: 'normal'
                });

                const loadedFont = await font.load();

                document.fonts.add(loadedFont);
                document.body.style.fontFamily = `"${fontFamily}", sans-serif`;

                return loadedFont;
            } catch (error) {
                // silent fail as some fonts may have not all the font weights
            }
        },
        toggleDarkMode() {
            EventBus.emit('dark-mode-toggle', { dark: !this.$appState.darkTheme });
        },
        resolveColor(token) {
            if (token && token.startsWith('{') && token.endsWith('}')) {
                let cssVariable = $dt(token).variable.slice(4, -1);
                let color = getComputedStyle(document.documentElement).getPropertyValue(cssVariable);

                return this.removeAlphaTransparency(color);
            } else {
                return this.removeAlphaTransparency(token);
            }
        },
        resolveColorPlain(color) {
            if (color && color.startsWith('{') && color.endsWith('}')) {
                return $dt(color).variable;
            } else {
                return color;
            }
        },
        removeAlphaTransparency(color) {
            if (color && color.match(/^#[0-9a-fA-F]{8}$/)) {
                return color.slice(0, 7);
            }

            return color;
        }
    },
    computed: {
        libraryVersion() {
            return this.$appState.version || '';
        },
        viewTitle() {
            const view = this.$appState.designer.activeView;

            if (view === 'dashboard') {
                return 'Theme Designer';
            } else if (view === 'create_theme') {
                return 'Create Theme';
            } else if (view === 'editor') {
                return this.$appState.designer.theme.name;
            }

            return null;
        }
    }
};
</script>
