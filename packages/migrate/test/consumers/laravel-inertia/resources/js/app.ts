import Aura from '@primevue/themes/aura';
import { createInertiaApp } from '@inertiajs/vue3';
import { createApp, h, type DefineComponent } from 'vue';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import 'primeicons/primeicons.css';
import Home from './Pages/Home.vue';

createInertiaApp({
    resolve: () => Home as unknown as DefineComponent,
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(PrimeVue, { theme: { preset: Aura } })
            .use(ToastService)
            .use(ConfirmationService)
            .mount(el);
    }
});
