import Aura from '@primevue/themes/aura';

export default defineNuxtConfig({
    compatibilityDate: '2025-02-27',
    modules: ['@primevue/nuxt-module'],
    css: ['primeicons/primeicons.css'],
    primevue: {
        usePrimeVue: true,
        options: { ripple: true, theme: { preset: Aura } },
        components: { include: '*' },
        directives: { include: '*' },
        composables: { include: '*' }
    },
    build: { transpile: ['primevue'] }
});
