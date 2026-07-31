import { createApp } from 'vue';
import PrimeVue from 'openvue/config';
import Aura from '@openvue/themes/aura';
import ToastService from 'openvue/toastservice';
import 'primeicons/primeicons.css';
import App from './App.vue';

const app = createApp(App);

app.use(PrimeVue, { theme: { preset: Aura } });
app.use(ToastService);
app.mount('#app');
