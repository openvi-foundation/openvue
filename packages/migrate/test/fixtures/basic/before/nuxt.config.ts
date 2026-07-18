export default defineNuxtConfig({
    modules: ['@primevue/nuxt-module'],
    primevue: {
        options: { ripple: true }
    },
    build: {
        transpile: ['primevue']
    }
});
