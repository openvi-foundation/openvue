<template>
    <section id="templates" class="landing-templates landing-section">
        <div class="landing-container">
            <div class="template-head">
                <div class="landing-section-header">
                    <h2 class="landing-section-title">Start from a template</h2>
                    <p class="landing-section-detail">{{ name }} is a free admin dashboard for Vite, Vue 3 and TypeScript, built entirely with OpenVue. Clone it, point it at your API, ship it.</p>
                </div>
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

            <div v-if="showPreview" class="template-stage">
                <div class="template-window">
                    <div class="template-window-bar">
                        <span class="template-window-url"><i class="pi pi-lock" aria-hidden="true"></i>deni.openvue.dev</span>
                    </div>
                    <div class="template-shot">
                        <a :href="demoUrl" target="_blank" rel="noopener noreferrer" tabindex="-1" aria-hidden="true">
                            <img :src="previewSrc" alt="" width="1907" height="916" loading="lazy" @error="onPreviewError" />
                        </a>
                        <!-- Positions are fractions of the screenshot, taken from DashboardView.vue and the layout in openvi-foundation/deni. Update them with the image. -->
                        <OpenVueNuxtLink v-for="pin of pins" :key="pin.name" :to="pin.to" :class="['template-pin', { 'is-end': pin.end }]" :style="{ left: `${pin.x}%`, top: `${pin.y}%` }">
                            {{ pin.name }}
                        </OpenVueNuxtLink>
                    </div>
                </div>
            </div>
            <p v-if="showPreview" class="template-swipe-hint">Swipe the screenshot to see the whole dashboard.</p>
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
            pins: [
                { name: 'Breadcrumb', to: '/breadcrumb', x: 21, y: 3 },
                { name: 'IconField', to: '/iconfield', x: 74, y: 3 },
                { name: 'Button', to: '/button', x: 98, y: 10.5, end: true },
                { name: 'Chart', to: '/chart', x: 36, y: 50 },
                { name: 'DataTable', to: '/datatable', x: 28, y: 81 },
                { name: 'MeterGroup', to: '/metergroup', x: 84, y: 81 }
            ]
        };
    },
    computed: {
        /* If the shot ever goes missing the stage drops out rather than showing a broken image. */
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
