import AppTheme from '@/themes/app-theme';
import OpenVue from 'openvue/config';
import { reactive } from 'vue';

const $appState = {
    install: (Vue) => {
        Vue.config.globalProperties.$appState = reactive({
            preset: 'Aura',
            primary: 'noir',
            surface: null,
            darkTheme: false,
            codeSandbox: false,
            sourceType: 'options-api',
            newsActive: false,
            announcement: null,
            storageKey: 'openvue',
            // Left empty here on purpose: this plugin also runs on the server, where there is no
            // localStorage. AppDesigner hydrates it client-side to avoid a hydration mismatch.
            designer: {
                active: false,
                activeView: 'dashboard',
                activeTab: '0',
                theme: {
                    id: null,
                    name: null,
                    base: null,
                    preset: null,
                    config: null
                },
                acTokens: [],
                themes: []
            }
        });
    }
};

export default defineNuxtPlugin(async (nuxtApp) => {
    const runtimeConfig = useRuntimeConfig();

    nuxtApp.vueApp.use($appState);

    if (runtimeConfig.public.DEV_ENV === 'hot') {
        nuxtApp.vueApp.use(OpenVue, {
            theme: AppTheme
        });
    }
});
