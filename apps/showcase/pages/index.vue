<template>
    <div :class="containerClass">
        <!--<AppNews />-->
        <AppTopBar :showMenuButton="false" />
        <HeroSection />
        <FeaturesSection />
        <ThemeSection />
        <FooterSection />
        <Toast />
    </div>
</template>

<script>
import FeaturesSection from '@/components/landing/FeaturesSection.vue';
import FooterSection from '@/components/landing/FooterSection.vue';
import HeroSection from '@/components/landing/HeroSection.vue';
import ThemeSection from '@/components/landing/ThemeSection.vue';

export default {
    setup() {
        definePageMeta({
            layout: 'custom'
        });
    },
    props: {
        theme: {
            type: String,
            default: null
        }
    },
    computed: {
        containerClass() {
            return ['landing', { 'layout-news-active': this.$appState?.newsActive }];
        }
    },
    components: {
        HeroSection,
        ThemeSection,
        FeaturesSection,
        FooterSection
    }
};
</script>
