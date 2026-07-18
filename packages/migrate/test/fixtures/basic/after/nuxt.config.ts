export default defineNuxtConfig({
    modules: ['@openvue/nuxt-module'],
    primevue: {
        options: { ripple: true }
    },
    build: {
        transpile: ['openvue']
    }
});
