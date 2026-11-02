import AnimateOnScroll from 'openvue/animateonscroll';
import PrimeVue from 'openvue/config';
import ConfirmationService from 'openvue/confirmationservice';
import StyleClass from 'openvue/styleclass';
import ToastService from 'openvue/toastservice';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, {
        unstyled: true
    });
    nuxtApp.vueApp.directive('styleclass', StyleClass);
    nuxtApp.vueApp.directive('animateonscroll', AnimateOnScroll);
    nuxtApp.vueApp.use(ToastService);
    nuxtApp.vueApp.use(ConfirmationService);
});
