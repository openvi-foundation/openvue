import { definePreset, usePreset } from '@openvue/themes';
import * as designerStorage from '../designer/storage';
import { loadBase } from './bases';
import { BOOT_STYLE_ID, FONT_LINK_ID, SITE_THEME_KEY } from './boot';
import { RECIPE_COMPONENTS, buildPresetExt, fontStack, fontStylesheetUrl } from './compile';
import { resolveFontUrl } from './fonts';
import { DEFAULT_RECIPE, PRESETS, findPreset, isSameRecipe, normalizeRecipe } from './recipe';
import { scopedThemeCss } from './scope';

const STORE_VERSION = 1;

export const LIVE_STYLE_ID = 'openvue-site-theme-live';
export const QUIET_STYLE_ID = 'openvue-site-theme-quiet';

// Unlayered and more specific than the engine's `:root` and `.p-dark` rules, so these win.
const ROOT = 'html:root';
const DARK_ROOT = 'html.p-dark:root';

const DEFAULT_SCALE = 14;

export function bootCss(compiled, recipe) {
    return scopedThemeCss(compiled, ROOT, {
        darkScope: DARK_ROOT,
        fontFamily: recipe.font === 'Inter var' ? undefined : fontStack(recipe.font),
        fontSize: recipe.scale === DEFAULT_SCALE ? undefined : recipe.scale + 'px'
    });
}

// The whole theme as CSS variables, valid as long as the engine holds the same base.
export function liveCss(compiled) {
    return scopedThemeCss(compiled, ROOT, { darkScope: DARK_ROOT, components: RECIPE_COMPONENTS, css: false });
}

export function readSiteTheme() {
    try {
        const stored = JSON.parse(window.localStorage.getItem(SITE_THEME_KEY) || 'null');

        return stored && stored.version === STORE_VERSION && stored.recipe ? normalizeRecipe(stored.recipe) : null;
    } catch {
        return null;
    }
}

export function writeSiteTheme(recipe, compiled, font = recipe.font === 'Inter var' ? null : fontStylesheetUrl(recipe.font)) {
    try {
        window.localStorage.setItem(SITE_THEME_KEY, JSON.stringify({ version: STORE_VERSION, recipe, css: bootCss(compiled, recipe), font }));

        return true;
    } catch {
        return false;
    }
}

export function wornPresetName(appState) {
    if (appState.siteRecipe) return findPreset(appState.siteRecipe)?.name ?? null;

    if (appState.designer?.theme?.id) return null;

    const { preset, primary, surface } = appState;

    return preset === 'Aura' && primary === 'noir' && !surface ? PRESETS[0].name : null;
}

export function clearSiteTheme() {
    try {
        window.localStorage.removeItem(SITE_THEME_KEY);
    } catch {}
}

function removeBootStyle() {
    document.getElementById(BOOT_STYLE_ID)?.remove();
}

function styleElement(id) {
    let style = document.getElementById(id);

    if (!style) {
        style = document.createElement('style');
        style.id = id;
        document.head.appendChild(style);
    }

    return style;
}

function applyFont(font, href) {
    const root = document.documentElement;
    let link = document.getElementById(FONT_LINK_ID);

    // The Theme Designer sets its font on <body>, which would hide this one.
    document.body.style.removeProperty('font-family');

    if (font === 'Inter var') {
        link?.remove();
        root.style.removeProperty('font-family');

        return;
    }

    if (!link) {
        link = document.createElement('link');
        link.id = FONT_LINK_ID;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }

    if (link.getAttribute('href') !== href) link.setAttribute('href', href);

    root.style.fontFamily = fontStack(font);
}

function applyScale(scale) {
    const root = document.documentElement;

    if (scale === DEFAULT_SCALE) root.style.removeProperty('font-size');
    else root.style.fontSize = scale + 'px';
}

function whenIdle(callback) {
    if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(callback, { timeout: 1000 });
    else callback();
}

export function createSiteTheme({ appState, primevue, defaultPreset, emit = () => {} }) {
    let applyCount = 0;
    let persistTimer = null;
    let quietTimer = null;
    let paletteTimer = null;
    let live = false;
    // Reference-counted: the builder page and the home page builder overlap during route changes.
    let liveHolders = 0;
    let engineBase = null;
    let pending = null;

    function setInputVariant(input) {
        primevue().config.inputVariant = input === 'filled' ? 'filled' : null;
    }

    function setRipple(ripple) {
        if (primevue().config.ripple !== ripple) primevue().config.ripple = ripple;
    }

    function quiet() {
        styleElement(QUIET_STYLE_ID).textContent = '*,*::before,*::after{transition:none!important}';
        clearTimeout(quietTimer);
        quietTimer = setTimeout(() => document.getElementById(QUIET_STYLE_ID)?.remove(), 250);
    }

    function removeLiveStyle() {
        document.getElementById(LIVE_STYLE_ID)?.remove();
    }

    function paletteChanged() {
        clearTimeout(paletteTimer);

        if (live) paletteTimer = setTimeout(() => emit('theme-palette-change'), 150);
        else emit('theme-palette-change');
    }

    function release({ restoreDefault = false } = {}) {
        const ripple = appState.siteRecipe?.ripple;

        applyCount++;
        clearTimeout(persistTimer);
        clearSiteTheme();
        removeBootStyle();
        removeLiveStyle();
        pending = null;
        engineBase = null;
        applyFont('Inter var');
        applyScale(DEFAULT_SCALE);
        setInputVariant(null);

        if (ripple) setRipple(false);

        appState.siteRecipe = null;

        if (restoreDefault) usePreset(defaultPreset);
    }

    function clearConfiguratorChoice() {
        appState.preset = 'Aura';
        appState.primary = 'noir';
        appState.surface = null;
    }

    // Otherwise the designer theme would come back on the next visit.
    function leaveDesigner() {
        if (designerStorage.getActiveId()) designerStorage.setActiveId(null);

        if (appState.designer?.theme?.id) {
            appState.designer.theme = { id: null, name: null, base: null, preset: null, config: null };
            appState.designer.activeView = 'dashboard';
        }
    }

    function reset() {
        release();
        usePreset(defaultPreset);
        clearConfiguratorChoice();
        paletteChanged();
    }

    function persist(recipe, compiled, fontUrl) {
        const ticket = applyCount;

        clearTimeout(persistTimer);
        persistTimer = setTimeout(
            () =>
                whenIdle(() => {
                    if (ticket !== applyCount) return;

                    if (isSameRecipe(recipe, DEFAULT_RECIPE)) clearSiteTheme();
                    else writeSiteTheme(recipe, compiled, fontUrl);
                }),
            300
        );
    }

    // In live mode a same-base edit only rewrites the live stylesheet; a base change goes through the engine.
    async function apply(recipe, { persist: remember = true } = {}) {
        const next = normalizeRecipe(recipe);
        const isDefault = isSameRecipe(next, DEFAULT_RECIPE);

        if (isDefault && !live) {
            if (remember) leaveDesigner();

            reset();

            return;
        }

        const ticket = ++applyCount;
        const [base, fontUrl] = await Promise.all([loadBase(next.base), resolveFontUrl(next.font)]);

        if (ticket !== applyCount) return;

        const compiled = definePreset(base, buildPresetExt(next, base));

        quiet();

        if (live && engineBase === next.base) {
            styleElement(LIVE_STYLE_ID).textContent = liveCss(compiled);
            pending = { recipe: next, compiled };
        } else {
            usePreset(compiled);
            removeLiveStyle();
            pending = null;
            engineBase = next.base;
        }

        applyFont(next.font, fontUrl);
        applyScale(next.scale);
        setInputVariant(next.input);
        setRipple(next.ripple);
        clearConfiguratorChoice();
        appState.siteRecipe = isDefault ? null : next;

        if (remember) leaveDesigner();

        paletteChanged();

        if (remember) persist(next, compiled, fontUrl);
    }

    function restore(recipe) {
        return applyCount === 0 && !live ? apply(recipe, { persist: false }) : Promise.resolve();
    }

    // Leaving live mode hands the live-painted theme to the engine.
    function setLive(value) {
        liveHolders = Math.max(0, liveHolders + (value ? 1 : -1));
        live = liveHolders > 0;

        if (!value && live) return;

        // The designer or the configurator may have replaced the engine's preset since the last visit.
        if (value) engineBase = null;

        if (value || !pending) return;

        const { recipe, compiled } = pending;

        pending = null;
        clearTimeout(paletteTimer);

        if (isSameRecipe(recipe, DEFAULT_RECIPE)) {
            reset();

            return;
        }

        quiet();
        usePreset(compiled);
        removeLiveStyle();
        emit('theme-palette-change');
    }

    return { apply, reset, release, restore, setLive, removeBootStyle };
}
