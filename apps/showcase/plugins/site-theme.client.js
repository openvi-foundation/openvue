import EventBus from '@/app/AppEventBus';
import { getActiveId } from '@/service/designer/storage';
import { createSiteTheme, readSiteTheme } from '@/service/theme/site';
import AppTheme from '@/themes/app-theme';

export default defineNuxtPlugin((nuxtApp) => {
    const globals = nuxtApp.vueApp.config.globalProperties;
    const appState = globals.$appState;
    const siteTheme = createSiteTheme({
        appState,
        primevue: () => globals.$primevue,
        defaultPreset: AppTheme.preset,
        emit: (event) => EventBus.emit(event)
    });

    nuxtApp.provide('siteTheme', siteTheme);

    const stored = readSiteTheme();

    // After hydration: changing state the markup depends on earlier leaves Vue with unpatched mismatches.
    nuxtApp.hooks.hookOnce('app:suspense:resolve', () => {
        const restored = stored && !getActiveId() ? siteTheme.restore(stored) : null;

        Promise.resolve(restored)
            .catch(() => {})
            .then(() => setTimeout(siteTheme.removeBootStyle, 300));
    });
});
