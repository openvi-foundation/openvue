import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import AnimateOnScroll from 'primevue/animateonscroll';
import StyleClass from 'primevue/styleclass';
import ToastService from 'primevue/toastservice';
import 'primeicons/primeicons.css';
import './style.css';
import App from './App.vue';

createApp(App).use(PrimeVue, { unstyled: true }).use(ToastService).use(ConfirmationService).directive('styleclass', StyleClass).directive('animateonscroll', AnimateOnScroll).mount('#app');
