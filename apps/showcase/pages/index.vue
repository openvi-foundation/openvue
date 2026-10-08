<template>
    <div :class="containerClass">
        <!--<AppNews />-->
        <AppTopBar :showDesigner="false" />
        <HeroSection />
        <ForkNoticeSection />
        <FeaturesSection />
        <ThemeSection />
        <TemplatesSection />
        <AppFooter show-cta />
        <Toast />
    </div>
</template>

<script>
import pkg from '../../../packages/primevue/package.json';
import FeaturesSection from '@/components/landing/FeaturesSection.vue';
import ForkNoticeSection from '@/components/landing/ForkNoticeSection.vue';
import HeroSection from '@/components/landing/HeroSection.vue';
import TemplatesSection from '@/components/landing/TemplatesSection.vue';
import ThemeSection from '@/components/landing/ThemeSection.vue';

export default {
    setup() {
        definePageMeta({
            layout: 'custom'
        });

        /* The homepage competes on two different intents: people shopping for a Vue component
           library, and people looking for where PrimeVue went. The title names both. */
        useSeo({
            title: 'OpenVue - Vue UI Components, MIT PrimeVue Fork',
            description: '80+ accessible, themeable components for Vue 3 and Nuxt. OpenVue is a fork of PrimeVue 4.5.5, MIT licensed, with the same API, themes and pass-through styling.',
            path: '/',
            jsonLd: {
                '@context': 'https://schema.org',
                '@graph': [
                    {
                        '@type': 'Organization',
                        '@id': `${SITE_URL}/#organization`,
                        name: 'OpenVI Foundation',
                        url: SITE_URL,
                        logo: `${SITE_URL}/open_vue_logo.svg`,
                        sameAs: ['https://github.com/openvi-foundation/openvue', 'https://www.npmjs.com/package/openvue']
                    },
                    {
                        '@type': 'WebSite',
                        '@id': `${SITE_URL}/#website`,
                        name: SITE_NAME,
                        url: SITE_URL,
                        inLanguage: 'en',
                        publisher: { '@id': `${SITE_URL}/#organization` },
                        potentialAction: {
                            '@type': 'SearchAction',
                            target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/components?q={search_term_string}` },
                            'query-input': 'required name=search_term_string'
                        }
                    },
                    {
                        '@type': 'SoftwareApplication',
                        name: 'OpenVue',
                        applicationCategory: 'DeveloperApplication',
                        operatingSystem: 'Any',
                        url: SITE_URL,
                        downloadUrl: 'https://www.npmjs.com/package/openvue',
                        softwareVersion: pkg.version,
                        license: 'https://opensource.org/licenses/MIT',
                        description: 'MIT-licensed UI component library for Vue 3 and Nuxt, forked from PrimeVue 4.5.5.',
                        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
                    }
                ]
            }
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
        ForkNoticeSection,
        ThemeSection,
        TemplatesSection,
        FeaturesSection
    }
};
</script>
