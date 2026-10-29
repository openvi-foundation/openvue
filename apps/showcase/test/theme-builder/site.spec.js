import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Theme, definePreset } from '@openvue/themes';
import Aura from '@openvue/themes/aura';
import Nora from '@openvue/themes/nora';
import { BOOT_SCRIPT, BOOT_STYLE_ID, FONT_LINK_ID, SITE_THEME_KEY } from '../../service/theme/boot';
import { buildPresetExt } from '../../service/theme/compile';
import { DEFAULT_RECIPE, PRESETS, presetRecipe } from '../../service/theme/recipe';
import { LIVE_STYLE_ID, QUIET_STYLE_ID, bootCss, clearSiteTheme, createSiteTheme, liveCss, readSiteTheme, wornPresetName, writeSiteTheme } from '../../service/theme/site';

const GARAGE = presetRecipe(PRESETS.find((preset) => preset.name === 'Garage'));

function fakeBrowser() {
    const items = new Map();
    const elements = [];
    const fakeStyle = () => ({
        fontFamily: '',
        removeProperty(name) {
            if (name === 'font-family') this.fontFamily = '';
        }
    });
    const rootStyle = fakeStyle();

    const createElement = (tag) => {
        const attributes = {};

        return {
            tag,
            attributes,
            textContent: '',
            setAttribute(name, value) {
                attributes[name] = value;
                if (name === 'id') this.id = value;
            },
            getAttribute: (name) => attributes[name],
            remove() {
                elements.splice(elements.indexOf(this), 1);
            }
        };
    };

    return {
        localStorage: {
            getItem: (key) => (items.has(key) ? items.get(key) : null),
            setItem: (key, value) => items.set(key, String(value)),
            removeItem: (key) => items.delete(key)
        },
        document: {
            documentElement: { style: rootStyle },
            body: { style: fakeStyle() },
            head: { appendChild: (element) => elements.push(element) },
            createElement,
            getElementById: (id) => elements.find((element) => element.id === id) || null
        },
        elements
    };
}

describe('theme-builder/site', () => {
    let browser;

    beforeEach(() => {
        browser = fakeBrowser();
        globalThis.window = { localStorage: browser.localStorage };
        globalThis.localStorage = browser.localStorage;
        globalThis.document = browser.document;
        Theme.setTheme({ preset: Aura, options: { prefix: 'p', darkModeSelector: '.p-dark' } });
    });

    afterEach(() => {
        delete globalThis.window;
        delete globalThis.localStorage;
        delete globalThis.document;
        Theme.setTheme(undefined);
    });

    describe('bootCss', () => {
        it('out-ranks the engine on the root element, in both colour schemes, with the font', () => {
            const css = bootCss(definePreset(Nora, buildPresetExt(GARAGE, Nora)), GARAGE);

            expect(css.startsWith('html:root{')).toBe(true);
            expect(css).toContain('html.p-dark:root{');
            expect(css).toContain('font-family:"Space Grotesk", sans-serif;');
            expect(css).toContain('--p-primary-500:#1d4ed8');
        });

        it('leaves the font alone for the site’s own Inter', () => {
            expect(bootCss(Aura, DEFAULT_RECIPE)).not.toContain('font-family');
        });
    });

    describe('storage', () => {
        it('round-trips a recipe and keeps the CSS and font for the boot script', () => {
            expect(writeSiteTheme(GARAGE, definePreset(Nora, buildPresetExt(GARAGE, Nora)))).toBe(true);

            const stored = JSON.parse(browser.localStorage.getItem(SITE_THEME_KEY));

            expect(readSiteTheme()).toEqual(GARAGE);
            expect(stored.font).toBe('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
            expect(stored.css).toContain('html:root{');

            clearSiteTheme();
            expect(readSiteTheme()).toBeNull();
        });

        it('validates what it reads back', () => {
            browser.localStorage.setItem(SITE_THEME_KEY, JSON.stringify({ version: 1, recipe: { base: 'Bootstrap', primary: 'javascript:alert(1)' } }));
            expect(readSiteTheme()).toEqual(DEFAULT_RECIPE);

            browser.localStorage.setItem(SITE_THEME_KEY, '{not json');
            expect(readSiteTheme()).toBeNull();
        });
    });

    describe('boot script', () => {
        const run = () => new Function('localStorage', 'document', BOOT_SCRIPT)(browser.localStorage, browser.document);

        it('paints the stored theme and loads its font before the app starts', () => {
            writeSiteTheme(GARAGE, definePreset(Nora, buildPresetExt(GARAGE, Nora)));
            run();

            expect(browser.document.getElementById(BOOT_STYLE_ID).textContent).toContain('html:root{');
            expect(browser.document.getElementById(FONT_LINK_ID).href).toContain('fonts.googleapis.com');
        });

        it('stays out of the way of an active Theme Designer theme', () => {
            writeSiteTheme(GARAGE, definePreset(Nora, buildPresetExt(GARAGE, Nora)));
            browser.localStorage.setItem('openvue-designer', JSON.stringify({ version: 1, themes: [], activeId: 'abc' }));
            run();

            expect(browser.elements).toHaveLength(0);
        });

        it('only loads fonts from Google Fonts and survives broken storage', () => {
            browser.localStorage.setItem(SITE_THEME_KEY, JSON.stringify({ version: 1, css: 'html:root{}', font: 'https://evil.example/font.css' }));
            run();
            expect(browser.document.getElementById(FONT_LINK_ID)).toBeNull();

            browser.localStorage.setItem(SITE_THEME_KEY, '{not json');
            expect(run).not.toThrow();
        });
    });

    describe('createSiteTheme', () => {
        function create() {
            const appState = { preset: 'Lara', primary: 'blue', surface: 'stone', siteRecipe: null, designer: { activeView: 'dashboard', theme: { id: null, name: null, base: null, preset: null, config: null } } };
            const primevue = { config: { inputVariant: null } };
            const events = [];
            const site = createSiteTheme({ appState, primevue: () => primevue, defaultPreset: Aura, emit: (event) => events.push(event) });

            return { site, appState, primevue, events };
        }

        it('applies a theme to the whole site, with its font and input variant', async () => {
            const { site, appState, primevue, events } = create();
            const atelier = presetRecipe(PRESETS.find((preset) => preset.name === 'Atelier'));

            await site.apply(atelier, { persist: false });

            expect(Theme.getPreset().semantic.primary[500]).toBe('#6d28d9');
            expect(appState.siteRecipe).toEqual(atelier);
            expect(primevue.config.inputVariant).toBe('filled');
            expect(browser.document.documentElement.style.fontFamily).toBe('"Poppins", sans-serif');
            expect(browser.document.getElementById(FONT_LINK_ID).getAttribute('href')).toContain('family=Poppins');
            expect(events).toContain('theme-palette-change');
        });

        // The Theme Designer writes its font on <body>, where it would hide the font set on the root.
        it('clears a font the Theme Designer left on the body', async () => {
            const { site } = create();

            browser.document.body.style.fontFamily = '"Inter var", sans-serif';
            await site.apply(GARAGE, { persist: false });

            expect(browser.document.body.style.fontFamily).toBe('');
            expect(browser.document.documentElement.style.fontFamily).toBe('"Space Grotesk", sans-serif');
        });

        // Releasing restores the documentation preset, so the configurator must describe that one.
        it('puts the configurator back on the documentation preset it replaces', async () => {
            const { site, appState } = create();

            await site.apply(GARAGE, { persist: false });

            expect(appState).toMatchObject({ preset: 'Aura', primary: 'noir', surface: null });
            expect(appState.siteRecipe).toEqual(GARAGE);
        });

        it('restores the stored theme only while nothing else has chosen one', async () => {
            const portico = presetRecipe(PRESETS.find((preset) => preset.name === 'Portico'));
            const fresh = create();

            await fresh.site.restore(GARAGE);
            expect(fresh.appState.siteRecipe).toEqual(GARAGE);

            const builder = create();

            builder.site.setLive(true);
            await builder.site.apply(portico, { persist: false });
            await builder.site.restore(GARAGE);
            expect(builder.appState.siteRecipe).toEqual(portico);

            const chosen = create();

            await chosen.site.apply(portico, { persist: false });
            await chosen.site.restore(GARAGE);
            expect(chosen.appState.siteRecipe).toEqual(portico);
        });

        it('loads a catalogue font with the weights it has', async () => {
            const { site } = create();

            await site.apply({ ...GARAGE, font: 'Lobster' }, { persist: false });

            expect(browser.document.getElementById(FONT_LINK_ID).getAttribute('href')).toBe('https://fonts.googleapis.com/css2?family=Lobster:wght@400&display=swap');
            expect(browser.document.documentElement.style.fontFamily).toBe('"Lobster", sans-serif');
        });

        it('lets the latest choice win when bases load out of order', async () => {
            const { site, appState } = create();
            const slow = site.apply(GARAGE, { persist: false });
            const fast = site.apply(presetRecipe(PRESETS.find((preset) => preset.name === 'Portico')), { persist: false });

            await Promise.all([slow, fast]);

            expect(appState.siteRecipe.primary).toBe('#c2410c');
        });

        it('resets to the documentation theme and forgets the stored one', async () => {
            const { site, appState, primevue } = create();

            await site.apply(GARAGE, { persist: false });
            writeSiteTheme(GARAGE, Theme.getPreset());
            site.reset();

            expect(Theme.getPreset()).toBe(Aura);
            expect(appState).toMatchObject({ siteRecipe: null, preset: 'Aura', primary: 'noir', surface: null });
            expect(primevue.config.inputVariant).toBeNull();
            expect(browser.document.documentElement.style.fontFamily).toBe('');
            expect(readSiteTheme()).toBeNull();
        });

        it('treats the default recipe as a reset', async () => {
            const { site, appState } = create();

            await site.apply(GARAGE, { persist: false });
            await site.apply(DEFAULT_RECIPE);

            expect(appState.siteRecipe).toBeNull();
            expect(Theme.getPreset()).toBe(Aura);
        });

        it('steps aside without touching the theme when something else takes over', async () => {
            const { site, appState } = create();

            await site.apply(GARAGE, { persist: false });

            const worn = Theme.getPreset();

            site.release();

            expect(appState.siteRecipe).toBeNull();
            expect(Theme.getPreset()).toBe(worn);
        });

        it('can put the documentation preset back while stepping aside', async () => {
            const { site } = create();

            await site.apply(GARAGE, { persist: false });
            site.release({ restoreDefault: true });

            expect(Theme.getPreset()).toBe(Aura);
        });

        // The builder previews a theme as it opens; only a theme the visitor keeps replaces the designer's.
        it('leaves an active Theme Designer theme alone while a theme is only previewed', async () => {
            const { site } = create();
            const activeId = () => JSON.parse(browser.localStorage.getItem('openvue-designer')).activeId;

            vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
            browser.localStorage.setItem('openvue-designer', JSON.stringify({ version: 1, themes: [], activeId: 'abc' }));

            try {
                site.setLive(true);
                await site.apply(DEFAULT_RECIPE, { persist: false });
                expect(activeId()).toBe('abc');

                await site.apply(GARAGE);
                expect(activeId()).toBeNull();
            } finally {
                vi.useRealTimers();
            }
        });

        // Picking Shoji, the default style, is a reset, and must replace the designer theme as any other choice does.
        it.each([
            ['the default theme', DEFAULT_RECIPE],
            ['a theme', GARAGE]
        ])('replaces an active Theme Designer theme with %s for good', async (_, recipe) => {
            const { site, appState } = create();

            vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
            browser.localStorage.setItem('openvue-designer', JSON.stringify({ version: 1, themes: [], activeId: 'abc' }));
            appState.designer.theme = { id: 'abc', name: 'Mine', base: 'Aura', preset: Aura, config: {} };
            appState.designer.activeView = 'editor';

            try {
                await site.apply(recipe);

                expect(JSON.parse(browser.localStorage.getItem('openvue-designer')).activeId).toBeNull();
                expect(appState.designer.theme.id).toBeNull();
                expect(appState.designer.activeView).toBe('dashboard');
            } finally {
                vi.useRealTimers();
            }
        });

        it('keeps the designer theme open while a theme is only previewed', async () => {
            const { site, appState } = create();

            appState.designer.theme = { id: 'abc', name: 'Mine', base: 'Aura', preset: Aura, config: {} };
            appState.designer.activeView = 'editor';
            site.setLive(true);
            await site.apply(GARAGE, { persist: false });

            expect(appState.designer.theme.id).toBe('abc');
            expect(appState.designer.activeView).toBe('editor');
        });

        // A write waiting for idle time must not bring back a theme that was released meanwhile.
        it('drops a pending save when the theme is released before it lands', async () => {
            const idle = [];
            const flush = () => idle.splice(0).forEach((callback) => callback());

            vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
            window.requestIdleCallback = (callback) => idle.push(callback);

            try {
                const kept = create();

                await kept.site.apply(GARAGE);
                vi.advanceTimersByTime(300);
                flush();
                expect(readSiteTheme()).toEqual(GARAGE);

                clearSiteTheme();

                const released = create();

                await released.site.apply(GARAGE);
                vi.advanceTimersByTime(300);
                released.site.release();
                flush();
                expect(readSiteTheme()).toBeNull();
            } finally {
                vi.useRealTimers();
            }
        });

        it('applies the ripple and the root font size, and takes them back on release', async () => {
            const { site, primevue } = create();
            const gazebo = presetRecipe(PRESETS.find((preset) => preset.name === 'Gazebo'));

            await site.apply({ ...gazebo, scale: 16 }, { persist: false });

            expect(primevue.config.ripple).toBe(true);
            expect(browser.document.documentElement.style.fontSize).toBe('16px');

            site.release();

            expect(primevue.config.ripple).toBe(false);
        });

        describe('live mode', () => {
            it('repaints edits on the same base without the engine, and hands them over on the way out', async () => {
                const { site, appState } = create();

                site.setLive(true);
                await site.apply(GARAGE, { persist: false });

                const engine = Theme.getPreset();

                await site.apply({ ...GARAGE, primary: '#be123c' }, { persist: false });

                expect(Theme.getPreset()).toBe(engine);
                expect(browser.document.getElementById(LIVE_STYLE_ID).textContent).toContain('--p-primary-500:#be123c');
                expect(appState.siteRecipe.primary).toBe('#be123c');

                site.setLive(false);

                expect(Theme.getPreset().semantic.primary[500]).toBe('#be123c');
                expect(browser.document.getElementById(LIVE_STYLE_ID)).toBeNull();
            });

            it('goes through the engine when the base changes', async () => {
                const { site } = create();

                site.setLive(true);
                await site.apply(GARAGE, { persist: false });
                await site.apply({ ...GARAGE, primary: '#be123c' }, { persist: false });
                await site.apply({ ...GARAGE, base: 'Aura' }, { persist: false });

                expect(Theme.getPreset().semantic.primary[500]).toBe('#1d4ed8');
                expect(Theme.getPreset().primitive.borderRadius.md).toBe('0');
                expect(browser.document.getElementById(LIVE_STYLE_ID)).toBeNull();
            });

            it('starts each session on the engine, whatever it was given in between', async () => {
                const { site } = create();

                site.setLive(true);
                await site.apply(GARAGE, { persist: false });
                site.setLive(false);
                Theme.setPreset(Aura);

                site.setLive(true);
                await site.apply({ ...GARAGE, primary: '#be123c' }, { persist: false });

                expect(Theme.getPreset().semantic.primary[500]).toBe('#be123c');
            });

            // The router may mount the Theme Builder page before it unmounts the home page's builder.
            it('stays live until the last holder lets go', async () => {
                const { site } = create();

                site.setLive(true);
                site.setLive(true);
                await site.apply(GARAGE, { persist: false });
                await site.apply({ ...GARAGE, primary: '#be123c' }, { persist: false });
                site.setLive(false);

                expect(browser.document.getElementById(LIVE_STYLE_ID)).not.toBeNull();
                expect(Theme.getPreset().semantic.primary[500]).toBe('#1d4ed8');

                await site.apply({ ...GARAGE, primary: '#0e7490' }, { persist: false });
                site.setLive(false);

                expect(browser.document.getElementById(LIVE_STYLE_ID)).toBeNull();
                expect(Theme.getPreset().semantic.primary[500]).toBe('#0e7490');
            });

            it('turns transitions off while the theme switches', async () => {
                const { site } = create();

                site.setLive(true);
                await site.apply(GARAGE, { persist: false });

                expect(browser.document.getElementById(QUIET_STYLE_ID).textContent).toContain('transition:none!important');
            });

            it('resets when the default theme is handed over', async () => {
                const { site, appState } = create();

                site.setLive(true);
                await site.apply(GARAGE, { persist: false });
                await site.apply({ ...DEFAULT_RECIPE, primary: 'teal' }, { persist: false });
                await site.apply(DEFAULT_RECIPE, { persist: false });

                expect(appState.siteRecipe).toBeNull();

                site.setLive(false);

                expect(Theme.getPreset()).toBe(Aura);
                expect(appState).toMatchObject({ preset: 'Aura', primary: 'noir', surface: null });
            });
        });
    });

    describe('wornPresetName', () => {
        const state = (changes = {}) => ({ preset: 'Aura', primary: 'noir', surface: null, siteRecipe: null, designer: { theme: { id: null } }, ...changes });

        it('names Shoji while nothing has changed the documentation’s own look', () => {
            expect(wornPresetName(state())).toBe('Shoji');
        });

        it('names the curated theme the site wears, and no theme for a custom one', () => {
            expect(wornPresetName(state({ siteRecipe: GARAGE }))).toBe('Garage');
            expect(wornPresetName(state({ siteRecipe: { ...GARAGE, radius: 5 } }))).toBeNull();
        });

        it('names no theme while a configurator change or a Theme Designer theme is worn', () => {
            expect(wornPresetName(state({ primary: 'emerald' }))).toBeNull();
            expect(wornPresetName(state({ designer: { theme: { id: 'abc' } } }))).toBeNull();
        });
    });

    describe('liveCss', () => {
        const css = liveCss(definePreset(Nora, buildPresetExt(GARAGE, Nora)));

        it('writes the whole palette for both colour schemes on the root element', () => {
            expect(css.startsWith('html:root{')).toBe(true);
            expect(css).toContain('html.p-dark:root{');
            expect(css).toContain('--p-primary-500:#1d4ed8');
            expect(css).toContain('--p-border-radius-md:0');
        });

        it('carries only the component tokens a recipe can change, and no component CSS', () => {
            expect(css).toContain('--p-button-padding-x:');
            expect(css).toContain('--p-card-shadow:');
            expect(css).not.toContain('--p-datatable-');
            expect(css).not.toContain('@layer');
        });
    });
});
