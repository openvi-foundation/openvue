import DeferredDemo from '@/components/demo/DeferredDemo.vue';
import OpenVueNuxtLink from '@/components/layout/OpenVueNuxtLink';
import CodeHighlight from '@/directives/CodeHighlight';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('code', CodeHighlight);
    nuxtApp.vueApp.component('DeferredDemo', DeferredDemo); // @todo
    nuxtApp.vueApp.component('OpenVueNuxtLink', OpenVueNuxtLink);
});
