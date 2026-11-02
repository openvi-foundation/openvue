<template>
    <section class="landing-hero px-8 lg:px-20">
        <div class="hero-grid">
            <div class="hero-content">
                <OpenVueNuxtLink to="/theme" class="hero-announcement">
                    <span class="hero-announcement-tag">New</span>
                    <span class="hero-announcement-full">Nide theme and Theme Builder: make OpenVue yours in a minute</span>
                    <span class="hero-announcement-short">Nide theme and Theme Builder</span>
                    <i class="pi pi-arrow-right" aria-hidden="true"></i>
                </OpenVueNuxtLink>
                <h1 class="hero-title">The complete UI toolkit for Vue and Nuxt</h1>
                <p class="hero-subtitle">80+ accessible, themeable components for Vue and Nuxt. OpenVue carries PrimeVue 4.5.5 forward under the MIT license, so the library your app already depends on stays free and keeps moving.</p>
                <div class="hero-actions">
                    <OpenVueNuxtLink to="/setup" class="linkbox linkbox-primary">
                        <span>Get Started</span>
                        <i class="pi pi-arrow-right ms-4"></i>
                    </OpenVueNuxtLink>
                    <a href="https://github.com/openvi-foundation/openvue" target="_blank" rel="noopener noreferrer" class="linkbox">
                        <i class="pi pi-github me-3"></i>
                        <span>Star on GitHub</span>
                        <span v-if="starsLabel" class="linkbox-count">{{ starsLabel }}</span>
                    </a>
                </div>
                <div class="hero-install">
                    <span class="hero-install-prompt" aria-hidden="true">$</span>
                    <code class="hero-install-command">{{ installCommand }}</code>
                    <button type="button" class="hero-install-copy" :aria-label="`Copy ${installCommand} to clipboard`" @click="copyInstallCommand">
                        <i :class="['pi', copied ? 'pi-check' : 'pi-copy']"></i>
                    </button>
                </div>
                <p class="hero-note">{{ version }} is out. MIT licensed, no paid tier.</p>
            </div>

            <HeroBuilder />
        </div>
    </section>
</template>

<script>
import pkg from '../../../../packages/primevue/package.json';
import HeroBuilder from './HeroBuilder.vue';

export default {
    components: { HeroBuilder },
    setup() {
        const { starsLabel } = useGitHubStars();

        return { starsLabel };
    },
    data() {
        return {
            version: pkg.version,
            installCommand: 'npm install openvue @openvue/themes',
            copied: false,
            copyTimeout: null
        };
    },
    beforeUnmount() {
        if (this.copyTimeout) {
            clearTimeout(this.copyTimeout);
        }
    },
    methods: {
        async copyInstallCommand() {
            try {
                await navigator.clipboard.writeText(this.installCommand);
            } catch {
                return;
            }

            this.copied = true;

            if (this.copyTimeout) {
                clearTimeout(this.copyTimeout);
            }

            this.copyTimeout = setTimeout(() => (this.copied = false), 2000);
        }
    }
};
</script>
