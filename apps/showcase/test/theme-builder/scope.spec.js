import { afterAll, describe, expect, it } from 'vitest';
import { Theme } from '@openvue/themes';
import BaseStyle from '@openvue/core/base/style';
import Aura from '@openvue/themes/aura';
import Material from '@openvue/themes/material';
import Nide from '@openvue/themes/nide';
import RadioButtonStyle from 'openvue/radiobutton/style';
import { presetCss, scopeClass, scopedThemeCss, structuralCss } from '../../service/theme/scope';

const OPTIONS = { prefix: 'p', darkModeSelector: '.p-dark', cssLayer: false };

function names(css) {
    return new Set([...css.matchAll(/(--p-[\w-]+):/g)].map((match) => match[1]));
}

function engineCss(preset, component) {
    Theme.setTheme({ preset, options: OPTIONS });

    return Theme.getCommonStyleSheet() + Theme.getStyleSheet(component);
}

describe('theme-builder/scope', () => {
    afterAll(() => {
        Theme.setTheme(undefined);
    });

    it.each([
        ['Aura', Aura],
        ['Nide', Nide]
    ])('%s declares every variable the engine would declare globally', (name, preset) => {
        const scoped = names(scopedThemeCss(preset, '.tb-scope-test'));

        // One variable per component that must be in the engine output, so an empty result cannot pass.
        const samples = { button: 'button-primary-background', inputtext: 'inputtext-background', datatable: 'datatable-header-background', tabs: 'tabs-tablist-background', tooltip: 'tooltip-background' };

        for (const [component, sample] of Object.entries(samples)) {
            const engine = names(engineCss(preset, component));
            const missing = [...engine].filter((variable) => !scoped.has(variable));

            expect(engine.has('--p-' + sample), component).toBe(true);
            expect(missing, component).toEqual([]);
        }
    });

    it('confines light values to the class and dark values to the class under dark mode', () => {
        const css = scopedThemeCss(Aura, '.tb-scope-test');
        const [light, dark] = css.split('\n');

        expect(light.startsWith('.tb-scope-test{')).toBe(true);
        expect(light).toContain('--p-primary-color:var(--p-primary-500)');
        expect(dark.startsWith('.p-dark .tb-scope-test{')).toBe(true);
        expect(dark).toContain('--p-primary-color:var(--p-primary-400)');
        expect(css).not.toContain(':root');
    });

    it('accepts a full dark-mode selector for the root element', () => {
        const css = scopedThemeCss(Aura, 'html:root', { components: [], darkScope: 'html.p-dark:root' });

        expect(css.split('\n')[1].startsWith('html.p-dark:root{')).toBe(true);
    });

    it('can limit itself to a few components', () => {
        const css = scopedThemeCss(Aura, '.tb-scope-test', { components: ['button'] });

        expect(css).toContain('--p-button-primary-background');
        expect(css).not.toContain('--p-datatable-');
    });

    it('nests a preset’s own component CSS under the class, inside the component layer', () => {
        const css = scopedThemeCss(Nide, '.tb-scope-test', { components: ['tabs'] });
        const nested = css.slice(css.indexOf('@layer'));

        expect(nested.startsWith('@layer openvue{:where(.tb-scope-test){')).toBe(true);
        expect(nested).not.toContain('dt(');
        expect(nested).toContain('var(--p-');
    });

    it('sets the font for everything inside the scope', () => {
        expect(scopedThemeCss(Aura, '.x', { components: [], fontFamily: '"Geist", sans-serif' })).toContain('font-family:"Geist", sans-serif;');
    });

    it('turns preset names into class names', () => {
        expect(scopeClass('Midnight Ledger')).toBe('tb-scope-midnight-ledger');
    });

    it('collects the base and structural styles of components, with every dt() resolved', () => {
        const css = structuralCss([BaseStyle, RadioButtonStyle]);

        expect(css).toContain('box-sizing: border-box');
        expect(css).toContain('.p-radiobutton-box');
        expect(css).toContain('var(--p-radiobutton-width)');
        expect(css).not.toContain('dt(');
    });

    it('collects only the asked components of a preset’s own CSS', () => {
        const css = presetCss(Material, ['radiobutton']);

        expect(css).toContain('.p-radiobutton-box');
        expect(css).not.toContain('.p-checkbox');
        expect(css).not.toContain('dt(');
        expect(presetCss(Aura, ['radiobutton'])).toBe('');
    });
});
