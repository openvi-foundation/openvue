<template>
    <section class="landing-footer">
        <div class="footer-cta">
            <div class="footer-container flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h2 class="footer-cta-title">Keep the library you already build on</h2>
                    <p class="footer-cta-text">Free, MIT, and maintained by the people who use it.</p>
                </div>
                <div class="flex items-center gap-3">
                    <OpenVueNuxtLink to="/setup" class="linkbox linkbox-primary">
                        <span>Get Started</span>
                        <i class="pi pi-arrow-right ms-4"></i>
                    </OpenVueNuxtLink>
                    <a href="https://github.com/openvi-foundation/openvue" target="_blank" rel="noopener noreferrer" class="linkbox">
                        <span>Star on GitHub</span>
                    </a>
                </div>
            </div>
        </div>

        <div class="footer-main">
            <div class="footer-container flex flex-wrap gap-y-12">
                <div class="w-full lg:w-4/12 pe-8">
                    <img src="/open_vue_logo.svg" class="footer-logo" alt="OpenVue" width="66" height="31" />
                    <p class="footer-tagline">A community fork of PrimeVue 4.5.5, maintained under the MIT license.</p>
                    <a href="https://www.openvi.dev/" class="footer-link inline-flex items-center gap-2 mt-4" target="_blank" rel="noopener noreferrer">
                        <span>openvi.dev</span>
                        <i class="pi pi-external-link !text-xs"></i>
                    </a>
                </div>

                <div v-for="group in groups" :key="group.title" class="w-6/12 lg:w-2/12">
                    <ul class="list-none p-0 m-0">
                        <li class="footer-group-title">{{ group.title }}</li>
                        <li v-for="link in group.links" :key="link.label" class="mb-4">
                            <a v-if="link.href" :href="link.href" class="footer-link" :target="link.external ? '_blank' : null" :rel="link.external ? 'noopener noreferrer' : null">{{ link.label }}</a>
                            <OpenVueNuxtLink v-else :to="link.to" class="footer-link">{{ link.label }}</OpenVueNuxtLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="footer-bottom">
            <div class="footer-container flex flex-wrap items-center justify-between gap-4">
                <span class="footer-note">Released under the MIT License.</span>
                <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <a href="mailto:contact@openvi.dev" class="footer-link footer-note inline-flex items-center gap-2">
                        <i class="pi pi-envelope !text-xs"></i>
                        <span>contact@openvi.dev</span>
                    </a>
                    <span class="footer-note">Not affiliated with PrimeTek.</span>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
const REPO = 'https://github.com/openvi-foundation/openvue';

export default {
    data() {
        return {
            groups: [
                {
                    title: 'Docs',
                    links: [
                        { label: 'Get Started', to: '/setup' },
                        { label: 'Components', to: '/components' },
                        { label: 'Theming', to: '/theming/styled' }
                    ]
                },
                {
                    title: 'Project',
                    links: [
                        { label: 'Issues', href: `${REPO}/issues`, external: true },
                        { label: 'Changelog', href: `${REPO}/releases`, external: true },
                        { label: 'Source Code', href: REPO, external: true }
                    ]
                },
                {
                    title: 'Migration',
                    links: [
                        { label: 'From PrimeVue v4', to: '/migrate' },
                        { label: 'Codemod', href: 'https://www.npmjs.com/package/@openvue/migrate', external: true },
                        { label: 'Nuxt', to: '/nuxt' }
                    ]
                },
                {
                    title: 'Community',
                    links: [
                        { label: 'GitHub', href: REPO, external: true },
                        { label: 'Discussions', href: `${REPO}/discussions`, external: true },
                        { label: 'Contributing', to: '/contribution' },
                        { label: 'Team', to: '/team' }
                    ]
                }
            ]
        };
    }
};
</script>
