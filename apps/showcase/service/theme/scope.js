import { dt, evaluateDtExpressions, toVariables } from '@openvue/themes';

const PREFIX = 'p';
const LAYER = 'openvue';

function declarations(source) {
    return toVariables(source, { prefix: PREFIX }).declarations;
}

function split(scheme = {}) {
    const { dark = {}, ...light } = scheme;

    return { light, dark };
}

function resolveCss(css) {
    const text = typeof css === 'function' ? css({ dt }) : css;

    return typeof text === 'string' ? evaluateDtExpressions(text, dt) : '';
}

// Writes a preset's variables onto a selector instead of :root, split the way the engine splits them.
export function scopedThemeCss(preset, selector, { components, darkSelector = '.p-dark', darkScope = `${darkSelector} ${selector}`, fontFamily, fontSize, css: withCss = true } = {}) {
    const { primitive = {}, semantic = {}, extend = {} } = preset;
    const { colorScheme, ...semanticRest } = semantic;
    const { colorScheme: extendScheme, ...extendRest } = extend;
    const semanticSchemes = split(colorScheme);
    const extendSchemes = split(extendScheme);

    let light = declarations({ primitive }) + declarations({ semantic: semanticRest }) + declarations({ light: semanticSchemes.light }) + declarations({ semantic: extendRest }) + declarations({ light: extendSchemes.light });
    let dark = declarations({ dark: semanticSchemes.dark }) + declarations({ dark: extendSchemes.dark });
    const custom = [];
    const entries = { ...(preset.directives || {}), ...(preset.components || {}) };

    for (const name of components || Object.keys(entries)) {
        const tokens = entries[name];

        if (!tokens) continue;

        const { colorScheme: scheme, extend: componentExtend = {}, css, ...rest } = tokens;
        const { colorScheme: componentExtendScheme, ...componentExtendRest } = componentExtend;
        const schemes = split(scheme);
        const extendedSchemes = split(componentExtendScheme);

        light += declarations({ [name]: { ...rest, ...componentExtendRest } }) + declarations({ [name]: { ...schemes.light, ...extendedSchemes.light } });
        dark += declarations({ [name]: { ...schemes.dark, ...extendedSchemes.dark } });

        if (css && withCss) custom.push(resolveCss(css));
    }

    if (preset.css && withCss) custom.unshift(resolveCss(preset.css));

    const font = (fontFamily ? `font-family:${fontFamily};` : '') + (fontSize ? `font-size:${fontSize};` : '');
    const rules = [`${selector}{${light}${font}}`, `${darkScope}{${dark}}`];
    const nested = custom.filter(Boolean).join('\n');

    // `:where` and the engine's layer keep the preset CSS ranked as it is when the theme is global.
    if (nested) rules.push(`@layer ${LAYER}{:where(${selector}){${nested}}}`);

    return rules.join('\n');
}

// For shadow roots, which page stylesheets do not reach; variables still inherit from the host.
export function structuralCss(styles) {
    return styles
        .flatMap((module) => [module.style, module.css])
        .map(resolveCss)
        .filter(Boolean)
        .join('\n');
}

export function presetCss(preset, components) {
    const entries = { ...(preset.directives || {}), ...(preset.components || {}) };

    return [preset.css, ...components.map((name) => entries[name]?.css)].map(resolveCss).filter(Boolean).join('\n');
}

export function scopeClass(name) {
    return (
        'tb-scope-' +
        String(name)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
    );
}
