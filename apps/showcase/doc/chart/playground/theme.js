import { ThemeService } from '@openuxkit/styled';
import { getChartTheme } from 'openvue/chart/utils/ChartTheme';

/*
 * The series swatches next to each name have to be the colours the canvas actually paints, so they
 * are read from the same helper the component uses rather than from a copy of the palette kept
 * here. A copy would drift the moment the theme palette changes, and would not follow dark mode.
 */

export function resolvePalette(element, type, datasetCount) {
    return getChartTheme(element, type, datasetCount)?.palette ?? [];
}

/**
 * Calls back whenever the active theme changes, covering both a preset swap and a dark mode toggle.
 * Returns the teardown. Mirrors what Chart does internally, since a preset emits through
 * ThemeService while a dark mode toggle only rewrites custom properties and emits nothing.
 */
export function observeTheme(handler) {
    if (typeof window === 'undefined') return () => {};

    ThemeService.on('theme:change', handler);

    const observer = typeof MutationObserver !== 'undefined' ? new MutationObserver(handler) : null;

    observer?.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });

    return () => {
        ThemeService.off('theme:change', handler);
        observer?.disconnect();
    };
}
