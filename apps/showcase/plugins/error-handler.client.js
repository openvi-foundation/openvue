/* Nuxt installs a Vue error handler for the whole hydration phase that turns any component error
   into the fatal error page. On this site every page is fully server-rendered, so a component that
   fails while hydrating is far less harmful than replacing the finished page with error.vue: search
   engines index the rendered DOM, and the swap was how the homepage ended up tagged noindex.

   Overriding the handler keeps such failures local to the component that threw. Nuxt only unsets
   its own handler after hydration, so this one stays for the life of the app and keeps logging. */
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
        console.error(`[openvue] Vue error during ${info}`, error, instance?.$options?.name || instance?.$options?.__name || '');
    };
});
