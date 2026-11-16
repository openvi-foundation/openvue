import { $t } from '@openvue/themes';
import Aura from '@openvue/themes/aura';
import { SURFACES, primaryPalette, primaryScheme } from '@/service/theme/compile';

// Shared by the topbar configurator and the homepage hero, so both switch the site preset the same way.
export const PRESET_OPTIONS = [
    { label: 'Nide', value: 'Nide' },
    { label: 'Aura', value: 'Aura' },
    { label: 'Material', value: 'Material' },
    { label: 'Lara', value: 'Lara' },
    { label: 'Nora', value: 'Nora' }
];

// Loaded on demand: each preset is close to 100 KB.
export const loadedPresets = { Aura };

const presetLoaders = {
    Lara: () => import('@openvue/themes/lara'),
    Material: () => import('@openvue/themes/material'),
    Nora: () => import('@openvue/themes/nora'),
    Nide: () => import('@openvue/themes/nide')
};

async function loadPreset(name) {
    if (!loadedPresets[name] && presetLoaders[name]) {
        loadedPresets[name] = (await presetLoaders[name]()).default;
    }

    return loadedPresets[name];
}

export function presetExtension(appState) {
    const base = appState.preset;
    const primary = appState.primary;

    document.documentElement.style.setProperty('--logo-color', primary === 'noir' ? 'var(--text-secondary-color)' : 'var(--primary-color)');

    return { semantic: { primary: primaryPalette(primary), colorScheme: primaryScheme(base, primary) } };
}

// A theme worn from the Theme Builder still sits on one of the presets, so the switchers show that one instead of nothing.
export function selectedPreset(appState) {
    return appState.siteRecipe?.base ?? appState.preset;
}

export function releaseSiteTheme(appState, siteTheme) {
    if (appState.siteRecipe) siteTheme.release({ restoreDefault: true });
}

export async function applySitePreset(appState, siteTheme, name) {
    releaseSiteTheme(appState, siteTheme);
    appState.preset = name;

    const preset = await loadPreset(name);

    if (appState.preset !== name) return;

    $t().preset(preset).preset(presetExtension(appState)).surfacePalette(SURFACES[appState.surface]).use({ useDefaultOptions: true });
}
