import fs from 'fs';
import path from 'path';

const baseUrl = '/';

const alias = {
    openvue: path.resolve(__dirname, '../../packages/primevue/src'),
    '@openvue/core': path.resolve(__dirname, '../../packages/core/src'),
    '@openvue/icons': path.resolve(__dirname, '../../packages/icons/src')
};

let PROCESS_ENV = {};

try {
    PROCESS_ENV = process?.env || {};
} catch {
    // NOOP
}

// Nested page paths that need redirects (e.g., /theming/styled.md -> /llms/pages/styled.md)
const nestedPagePaths = {
    'theming/styled': 'styled',
    'theming/unstyled': 'unstyled',
    'guides/accessibility': 'accessibility',
    'guides/animations': 'animations',
    'guides/dynamicimports': 'dynamicimports',
    'guides/rtl': 'rtl',
    'guides/migration/v4': 'v4'
};

const markdownRedirects = (() => {
    const rules = {};
    const llmsDir = path.resolve(__dirname, 'server/assets/llms');

    try {
        // Add nested path redirects
        for (const [nestedPath, fileName] of Object.entries(nestedPagePaths)) {
            rules[`/${nestedPath}.md`] = { redirect: { to: `/llms/pages/${fileName}.md`, statusCode: 301 } };
        }

        // Add direct page redirects
        for (const file of fs.readdirSync(path.join(llmsDir, 'pages'))) {
            rules[`/${file}`] = { redirect: { to: `/llms/pages/${file}`, statusCode: 301 } };
        }

        // Add component redirects
        for (const file of fs.readdirSync(path.join(llmsDir, 'components'))) {
            if (!rules[`/${file}`]) {
                rules[`/${file}`] = { redirect: { to: `/llms/components/${file}`, statusCode: 301 } };
            }
        }
    } catch {
        // Silently fail if llms directory doesn't exist yet
    }

    return rules;
})();

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: false },
    modules: ['@openvue/nuxt-module', '@nuxtjs/sitemap', '@vercel/analytics/nuxt', '@vercel/speed-insights/nuxt'],
    site: {
        url: 'https://openvue.dev',
        name: 'OpenVue'
    },
    components: [
        {
            path: '~/components',
            pathPrefix: false
        }
    ],
    vite: {
        optimizeDeps: {
            noDiscovery: true,
            include: ['quill', 'yup']
        },
        resolve: {
            dedupe: ['vue', '@primeuix/styles', '@primeuix/themes', '@primeuix/utils'],
            alias
        }
    },
    nitro: {
        alias
    },
    routeRules: {
        '/accessibility': { redirect: { to: '/guides/accessibility', statusCode: 301 } },
        '/installation': { redirect: { to: '/vite', statusCode: 301 } },
        ...markdownRedirects
    },
    primevue: {
        usePrimeVue: process.env.DEV_ENV !== 'hot',
        autoImport: true, // When enabled, the module automatically imports OpenVue components and directives used throughout the application.
        importTheme: { from: '@/themes/app-theme.js' }
    },
    app: {
        baseURL: baseUrl,
        head: {
            title: 'OpenVue - Vue UI Component Library',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: 'description', content: 'The ultimate collection of design-agnostic, flexible and accessible Vue UI Components.' },
                { name: 'robots', content: 'index,follow' },
                { name: 'twitter:card', content: 'summary_large_image' },
                { name: 'twitter:title', content: 'OpenVue | Vue UI Component Library' },
                { name: 'twitter:description', content: 'The ultimate collection of design-agnostic, flexible and accessible Vue UI Components.' },
                { name: 'twitter:image', content: 'https://openvue.dev/open_vue_logo.png' },
                { property: 'og:type', content: 'website' },
                { property: 'og:site_name', content: 'OpenVue' },
                { property: 'og:title', content: 'OpenVue | Vue UI Component Library' },
                { property: 'og:url', content: 'https://openvue.dev/' },
                { property: 'og:description', content: 'The ultimate collection of design-agnostic, flexible and accessible Vue UI Components.' },
                { property: 'og:image', content: 'https://openvue.dev/open_vue_logo.png' },
                { property: 'og:image:width', content: '2400' },
                { property: 'og:image:height', content: '2400' },
                { property: 'og:image:alt', content: 'OpenVue - Vue UI Component Library' },
                { property: 'og:ttl', content: '604800' }
            ],
            link: [
                { rel: 'icon', type: 'image/svg+xml', href: baseUrl + 'favicon.svg' },
                { rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' }
            ],
            script: [
                {
                    src: baseUrl + 'scripts/prism.js',
                    'data-manual': true
                }
            ]
        }
    },
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {}
        }
    },
    runtimeConfig: {
        public: {
            contextPath: baseUrl,
            DEV_ENV: PROCESS_ENV.DEV_ENV
        }
    },
    css: ['primeicons/primeicons.css', '@/assets/styles/flags.css', '@/assets/styles/tailwind/main.css', '@/assets/styles/layout/layout.scss']
});
