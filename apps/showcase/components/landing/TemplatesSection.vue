<template>
    <section class="landing-templates py-20">
        <div class="section-header">Templates</div>
        <p class="section-detail">Real applications built with OpenVue. Clone one, point it at your API, ship it.</p>
        <div class="mt-16 px-8 lg:px-20">
            <div class="templates-container">
                <div v-animateonscroll.once="{ enterClass: 'animate-fadein' }" class="box template-card animate-duration-500">
                    <a v-if="showPreview" :href="demoUrl" target="_blank" rel="noopener noreferrer" class="template-preview" :aria-label="`Open the ${name} live demo`">
                        <img :src="previewSrc" :alt="`${name} admin dashboard template built with OpenVue`" width="1907" height="916" loading="lazy" @error="onPreviewError" />
                    </a>
                    <div class="template-main p-8 lg:p-12">
                        <span class="template-kicker">Admin Dashboard</span>
                        <div class="template-heading">
                            <h3 class="template-title">{{ name }}</h3>
                            <Tag value="NEW" />
                        </div>
                        <p class="template-text">Deni is a free admin dashboard template for OpenVue, built with Vite, Vue 3 and TypeScript.</p>
                        <ul class="template-highlights">
                            <li v-for="highlight in highlights" :key="highlight">
                                <i class="pi pi-check" aria-hidden="true"></i><span>{{ highlight }}</span>
                            </li>
                        </ul>
                        <div class="template-actions">
                            <a :href="demoUrl" target="_blank" rel="noopener noreferrer" class="linkbox linkbox-primary">
                                <span>Live Demo</span>
                                <i class="pi pi-arrow-up-right ms-4"></i>
                            </a>
                            <a :href="repoUrl" target="_blank" rel="noopener noreferrer" class="linkbox">
                                <span>View on GitHub</span>
                                <i class="pi pi-github ms-4"></i>
                            </a>
                        </div>
                    </div>
                </div>
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
            highlights: [
                '25+ screens: dashboard, CRUD tables, detail views, inbox, calendar, settings, auth and errors',
                'Four presets with light, dim and dark schemes, saved between visits',
                'Paged tables with search, filters, sorting, multi-select, bulk actions and CSV export',
                'Vite, Vue 3 and TypeScript, with form validation via @openvue/forms and zod'
            ]
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
