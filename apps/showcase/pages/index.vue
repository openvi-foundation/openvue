<template>
    <div :class="containerClass">
        <!--<AppNews />-->
        <AppTopBar @menubutton-click="onMenuButtonClick" />
        <Transition name="px-modal">
            <div v-if="sidebarActive" class="layout-mask" @click="onMaskClick"></div>
        </Transition>
        <app-menu :active="sidebarActive" />
        <HeroSection />
        <ForkNoticeSection />
        <FeaturesSection />
        <ThemeSection />
        <FooterSection />
        <Toast />
    </div>
</template>

<script>
import { blockBodyScroll, unblockBodyScroll } from '@openuxkit/utils/dom';
import FeaturesSection from '@/components/landing/FeaturesSection.vue';
import ForkNoticeSection from '@/components/landing/ForkNoticeSection.vue';
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
    data() {
        return {
            sidebarActive: false
        };
    },
    methods: {
        onMenuButtonClick() {
            if (this.sidebarActive) {
                this.onMaskClick();
            } else {
                this.sidebarActive = true;
                blockBodyScroll('blocked-scroll');
            }
        },
        onMaskClick() {
            this.sidebarActive = false;
            unblockBodyScroll('blocked-scroll');
        }
    },
    computed: {
        containerClass() {
            return ['landing', { 'layout-news-active': this.$appState?.newsActive }];
        }
    },
    components: {
        HeroSection,
        ForkNoticeSection,
        ThemeSection,
        FeaturesSection,
        FooterSection
    }
};
</script>
