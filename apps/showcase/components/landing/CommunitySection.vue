<template>
    <section class="landing-community landing-section">
        <div class="community-content">
            <h2 class="landing-section-title">Free, and built in the open</h2>
            <p class="landing-section-detail">
                OpenVue is MIT licensed with no paid tier. It keeps moving because people use it, report issues and send pull requests.
                <template v-if="usage"> {{ usage }}</template>
            </p>
            <div class="community-actions">
                <OpenVueNuxtLink to="/setup" class="linkbox linkbox-primary">
                    <span>Get Started</span>
                    <i class="pi pi-arrow-right ms-4"></i>
                </OpenVueNuxtLink>
                <a href="https://github.com/openvi-foundation/openvue" target="_blank" rel="noopener noreferrer" class="linkbox">
                    <i class="pi pi-github me-3"></i>
                    <span>Star on GitHub</span>
                </a>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    setup() {
        const { starsLabel } = useGitHubStars();
        const { downloadsLabel } = useNpmDownloads();

        return { starsLabel, downloadsLabel };
    },
    computed: {
        /* Live numbers only, said as a sentence. Whatever has not loaded is left out rather than shown as a gap. */
        usage() {
            const parts = [this.downloadsLabel && `${this.downloadsLabel} npm downloads last month`, this.starsLabel && `${this.starsLabel} stars on GitHub`].filter(Boolean);

            return parts.length ? `${parts.join(' and ')} so far.` : null;
        }
    }
};
</script>
