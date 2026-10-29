import { toIdentifier, toPresetSource } from '../designer/codegen';
import { deepDiff } from '../designer/diff';
import { fontStack, fontStylesheetUrl, googleFamily } from './compile';

const exportedFont = googleFamily;

// Bindings `main.js` declares itself.
const SETUP_BINDINGS = ['App', 'OpenVue'];

function setupIdentifier(name) {
    const identifier = toIdentifier(name);

    return SETUP_BINDINGS.includes(identifier) ? identifier + 'Theme' : identifier;
}

function toDocument(recipe, name, compiledPreset) {
    return {
        name,
        base: recipe.base,
        preset: compiledPreset,
        config: { font_family: exportedFont(recipe.font), font_size: recipe.scale + 'px' }
    };
}

export function toThemeSource(recipe, name, basePreset, compiledPreset) {
    return toPresetSource(toDocument(recipe, name, compiledPreset), { mode: 'diff', language: 'js', basePreset, generator: 'OpenVue Theme Builder' });
}

export function toThemeCss(recipe, { fontUrl } = {}) {
    const url = fontUrl || fontStylesheetUrl(recipe.font);

    return [`@import url('${url}');`, '', 'html {', `    font-size: ${recipe.scale}px;`, '}', '', 'body {', `    font-family: ${fontStack(exportedFont(recipe.font))};`, '}', ''].join('\n');
}

function configLines(recipe, indent) {
    const lines = [];

    if (recipe.input === 'filled') lines.push(indent + "inputVariant: 'filled'");
    if (recipe.ripple) lines.push(indent + 'ripple: true');

    return lines.map((line, index) => (index < lines.length - 1 ? line + ',' : line));
}

export function toVueSetup(recipe, name, { darkModeSelector } = {}) {
    const identifier = setupIdentifier(name);
    const theme = darkModeSelector ? [`        preset: ${identifier},`, '        options: {', `            darkModeSelector: '${darkModeSelector}'`, '        }'] : [`        preset: ${identifier}`];
    const options = ['    theme: {', ...theme, '    }'];
    const extra = configLines(recipe, '    ');

    if (extra.length) {
        options[options.length - 1] += ',';
        options.push(...extra);
    }

    return [
        "import { createApp } from 'vue';",
        "import OpenVue from 'openvue/config';",
        "import App from './App.vue';",
        `import ${identifier} from './theme';`,
        "import './theme.css';",
        '',
        'const app = createApp(App);',
        '',
        'app.use(OpenVue, {',
        ...options,
        '});',
        '',
        "app.mount('#app');",
        ''
    ].join('\n');
}

// The Nuxt module expects a theme configuration as the default export, so the preset is wrapped.
export function toNuxtThemeSource(recipe, name, basePreset, compiledPreset) {
    const source = toThemeSource(recipe, name, basePreset, compiledPreset);

    return source.replace(/export default ([A-Za-z_$][\w$]*);\n$/, (_, identifier) => `export default {\n    preset: ${identifier}\n};\n`);
}

export function toNuxtConfig(recipe) {
    const primevue = ['    primevue: {', "        importTheme: { from: '@/themes/theme.js' }", '    }'];
    const extra = configLines(recipe, '            ');

    if (extra.length) {
        primevue.splice(2, 0, '        options: {', ...extra, '        }');
        primevue[1] += ',';
    }

    return ['export default defineNuxtConfig({', "    modules: ['@openvue/nuxt-module'],", "    css: ['~/assets/css/theme.css'],", ...primevue, '});', ''].join('\n');
}

export function toExportFiles(recipe, name, basePreset, compiledPreset, { fontUrl } = {}) {
    const css = toThemeCss(recipe, { fontUrl });

    return {
        vue: [
            { name: 'src/theme.js', language: 'script', code: toThemeSource(recipe, name, basePreset, compiledPreset) },
            { name: 'src/main.js', language: 'script', code: toVueSetup(recipe, name) },
            { name: 'src/theme.css', language: 'css', code: css }
        ],
        nuxt: [
            { name: 'themes/theme.js', language: 'script', code: toNuxtThemeSource(recipe, name, basePreset, compiledPreset) },
            { name: 'nuxt.config.ts', language: 'script', code: toNuxtConfig(recipe) },
            { name: 'assets/css/theme.css', language: 'css', code: css }
        ]
    };
}

// Leaves out the full main.js and nuxt.config.ts, which an agent would paste over the project's own.
export function toAgentPrompt(files, { framework, recipe, name }) {
    const nuxt = framework === 'nuxt';
    const [theme, , css] = files;
    const title = String(name).replace(/\s+/g, ' ').trim();
    const options = [recipe.input === 'filled' && "`inputVariant: 'filled'`", recipe.ripple && '`ripple: true`'].filter(Boolean);
    const list = (items) => (items.length > 1 ? items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1] : items[0]);
    let setup;

    if (nuxt) {
        setup = `In \`nuxt.config.ts\`, add \`'~/${css.name}'\` to \`css\` and set \`primevue.importTheme\` to \`{ from: '@/${theme.name}' }\`${options.length ? `, and add ${list(options)} to \`primevue.options\`` : ''}.`;
    } else {
        const identifier = setupIdentifier(name);

        setup = `Where the app calls \`app.use(OpenVue, ...)\`, import \`./theme.css\` and \`${identifier}\` from \`./theme\`, then set ${list([`\`theme: { preset: ${identifier} }\``, ...options])}.`;
    }

    const lines = [
        `Add the OpenVue theme "${title}" to this project. It needs ${nuxt ? '`@openvue/nuxt-module`' : '`openvue`'} and \`@openvue/themes\`.`,
        '',
        `1. Save the two files below as \`${theme.name}\` and \`${css.name}\`. In a TypeScript project, name the first \`${theme.name.replace(/\.js$/, '.ts')}\`${nuxt ? ' and use that path in step 2' : ''}; the code stays the same.`,
        `2. ${setup} Keep the other options as they are.`,
        ''
    ];

    if (recipe.base === 'Nide') {
        lines.push('It is built on the Nide preset. If `@openvue/themes/nide` does not resolve, update `@openvue/themes` rather than switching to another preset.', '');
    }

    for (const file of [theme, css]) {
        lines.push('`' + file.name + '`', '', '```' + (file.name.endsWith('.css') ? 'css' : 'js'), file.code.trimEnd(), '```', '');
    }

    return lines.join('\n');
}

export function toDesignerPayload(recipe, name, basePreset, compiledPreset) {
    return {
        name,
        base: recipe.base,
        diff: deepDiff(basePreset, compiledPreset),
        removed: [],
        config: { font_family: recipe.font, font_size: recipe.scale + 'px' }
    };
}
