<template>
    <div :class="containerClass" :data-p-theme="$appState.theme">
        <!--<AppNews />-->
        <AppTopBar />
        <div class="layout-content">
            <app-menu />
            <main class="layout-content-slot">
                <slot></slot>
                <DocPager />
            </main>
        </div>
        <AppFooter />
        <Toast />
        <Toast position="top-left" group="tl" />
        <Toast position="bottom-left" group="bl" />
        <Toast position="bottom-right" group="br" />
        <ClientOnly>
            <AppDesigner />
        </ClientOnly>
    </div>
</template>

<script>
import DocPager from '@/components/doc/DocPager.vue';

export default {
    components: { DocPager },
    watch: {
        $route: {
            immediate: true,
            handler() {
                if (!process.client || typeof window === 'undefined') {
                    return;
                }

                this.$toast.removeAllGroups();
            }
        }
    },
    methods: {
        isOutdatedIE() {
            let ua = window.navigator.userAgent;

            if (ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0) {
                return true;
            }

            return false;
        }
    },
    computed: {
        containerClass() {
            return [
                'layout-wrapper layout-docs',
                {
                    'layout-news-active': this.$appState.newsActive
                }
            ];
        }
    }
};
</script>
