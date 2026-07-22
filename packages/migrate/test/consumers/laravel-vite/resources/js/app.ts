import Aura from '@primevue/themes/aura';
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import 'primeicons/primeicons.css';
import App from './App.vue';

createApp(App)
    .use(PrimeVue, { theme: { preset: Aura } })
    .use(ToastService)
    .directive('tooltip', Tooltip)
    .mount('#app');
