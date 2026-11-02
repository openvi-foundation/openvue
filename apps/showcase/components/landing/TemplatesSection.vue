<template>
    <section id="templates" class="landing-templates py-20 px-8 lg:px-20">
        <div class="templates-container">
            <div class="templates-header">
                <h2 class="templates-title">Start from a template</h2>
                <p class="templates-detail">A real application built with OpenVue. Clone it, point it at your API, ship it.</p>
            </div>

            <div class="template-card">
                <div class="template-main">
                    <h3 class="template-name">{{ name }}</h3>
                    <p class="template-text">A free admin dashboard for Vite, Vue 3 and TypeScript.</p>
                    <ul class="template-highlights">
                        <li v-for="item of highlights" :key="item">
                            <i class="pi pi-check" aria-hidden="true"></i>
                            <span>{{ item }}</span>
                        </li>
                    </ul>
                    <div class="template-actions">
                        <a :href="demoUrl" target="_blank" rel="noopener noreferrer" class="linkbox linkbox-primary">
                            <span>Live Demo</span>
                            <i class="pi pi-arrow-up-right ms-4"></i>
                        </a>
                        <a :href="repoUrl" target="_blank" rel="noopener noreferrer" class="linkbox">
                            <i class="pi pi-github me-3"></i>
                            <span>Source</span>
                        </a>
                    </div>
                </div>

                <!-- The shot is larger than its pane and runs off the right and bottom edges, so it reads as an app that keeps going. -->
                <a v-if="showPreview" :href="demoUrl" target="_blank" rel="noopener noreferrer" class="template-preview" tabindex="-1" aria-hidden="true">
                    <img :src="previewSrc" alt="" width="1907" height="916" loading="lazy" @error="onPreviewError" />
                </a>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            name: 'Deni',
            demoUrl: 'https://deni.openvue.dev/',
            repoUrl: 'https://github.com/openvi-foundation/deni',
            previewSrc: '/demo/images/templates/deni.png',
            previewFailed: false,
            highlights: ['25+ screens, from dashboard and CRUD to inbox, calendar and auth', 'Four presets with light, dim and dark schemes', 'Data tables with filters, bulk actions and CSV export', 'Forms validated with @openvue/forms and zod']
        };
    },
    computed: {
        /* If the shot ever goes missing the card drops the preview pane rather than showing a broken image. */
        showPreview() {
            return !this.previewFailed;
        }
    },
    methods: {
        onPreviewError() {
            this.previewFailed = true;
        }
    }
};
</script>
