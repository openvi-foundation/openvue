<template>
    <section class="landing-fork-notice py-20">
        <div class="section-header">Built on PrimeVue</div>
        <p class="section-detail">A fork of PrimeVue 4.5.5, kept alive and moving forward.</p>
        <div class="mt-16 px-8 lg:px-20">
            <div class="fork-notice-container">
                <div v-animateonscroll.once="{ enterClass: 'animate-fadein' }" class="box flex flex-col lg:flex-row animate-duration-500">
                    <div class="fork-notice-main p-8 lg:p-12">
                        <h3 class="fork-notice-title">Still open, still maintained</h3>
                        <p class="fork-notice-text">
                            PrimeVue 4.5.5 is the last release published under an open source license. It powers dashboards, internal tools and products across the Vue ecosystem, and a huge amount of work went into it. OpenVue continues that
                            work in the open under MIT, with bug fixes, accessibility and performance improvements, support for current Vue and Nuxt releases, and new components.
                        </p>
                        <div class="fork-notice-actions">
                            <OpenVueNuxtLink to="/setup" class="linkbox linkbox-primary">
                                <span>Get Started</span>
                                <i class="pi pi-arrow-right ms-4"></i>
                            </OpenVueNuxtLink>
                            <a href="https://github.com/openvi-foundation/openvue" target="_blank" rel="noopener noreferrer" class="linkbox">
                                <span>View on GitHub</span>
                                <i class="pi pi-github ms-4"></i>
                            </a>
                        </div>
                    </div>
                    <div class="fork-notice-aside p-8 lg:p-12">
                        <h3 class="fork-notice-title">Coming from PrimeVue v4?</h3>
                        <p class="fork-notice-text">
                            Your existing code keeps working. The component APIs, props, slots and theming are the same, so moving over is a matter of swapping package names rather than rewriting your app, and
                            <span class="fork-notice-code">@openvue/migrate</span> is a codemod in active development that will do that rewrite for you.
                        </p>
                        <div class="fork-notice-actions">
                            <OpenVueNuxtLink to="/migrate" class="linkbox">
                                <span>Migration guide</span>
                                <i class="pi pi-arrow-right ms-4"></i>
                            </OpenVueNuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {};
</script>
