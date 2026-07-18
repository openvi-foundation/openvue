<template>
    <section class="landing-features py-20">
        <div class="section-header">Features</div>
        <p class="section-detail">OpenVue is the most complete solution for your UI requirements.</p>
        <div class="mt-16 px-8 lg:px-20">
            <div class="features-container">
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 md:col-span-6 xl:col-span-3 flex justify-center">
                        <div v-animateonscroll.once="{ enterClass: 'animate-fadein' }" class="box p-6 w-full animate-duration-500">
                            <img src="https://primefaces.org/cdn/primevue/images/landing/features/icon-components.svg" alt="components icon" class="block mb-4" />
                            <div class="font-semibold mb-4 text-lg">80+ UI Components</div>
                            <p class="m-0 text-surface-500 dark:text-surface-400 font-medium">The ultimate set of UI Components to assist you with 80+ impressive Vue Components.</p>
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-6 xl:col-span-3 flex justify-center">
                        <div v-animateonscroll.once="{ enterClass: 'animate-fadein' }" class="box p-6 w-full animate-duration-500">
                            <img src="https://primefaces.org/cdn/primevue/images/landing/features/icon-theme.svg" alt="components icon" class="block mb-4" />
                            <div class="font-semibold mb-4 text-lg">Styled or Unstyled</div>
                            <p class="m-0 text-surface-500 dark:text-surface-400 font-medium">Choose from a variety of pre-built themes or implement your design systems with the CSS library of your choice like TailwindCSS.</p>
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-6 xl:col-span-3 flex justify-center">
                        <div v-animateonscroll.once="{ enterClass: 'animate-fadein' }" class="box p-6 w-full animate-duration-500">
                            <img src="https://primefaces.org/cdn/primevue/images/landing/features/icon-community.svg" alt="components icon" class="block mb-4" />
                            <div class="font-semibold mb-4 text-lg">Community</div>
                            <p class="m-0 text-surface-500 dark:text-surface-400 font-medium">Connect with the other open source community members, collaborate and have a voice in the project roadmap.</p>
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-6 xl:col-span-3 flex justify-center">
                        <div v-animateonscroll.once="{ enterClass: 'animate-fadein' }" class="box p-6 w-full animate-duration-500">
                            <img src="https://primefaces.org/cdn/primevue/images/landing/features/icon-accessibility.svg" alt="components icon" class="block mb-4" />
                            <div class="font-semibold mb-4 text-lg">Accessibility</div>
                            <p class="m-0 text-surface-500 dark:text-surface-400 font-medium">Compliant with the Web Content Accessibility Guidelines (WCAG 2.0).</p>
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-6 xl:col-span-3 flex justify-center">
                        <div v-animateonscroll.once="{ enterClass: 'animate-fadein' }" class="box p-6 w-full animate-duration-500">
                            <img src="https://primefaces.org/cdn/primevue/images/landing/features/icon-support.svg" alt="components icon" class="block mb-4" />
                            <div class="font-semibold mb-4 text-lg">Free & Open Source</div>
                            <p class="m-0 text-surface-500 dark:text-surface-400 font-medium">MIT licensed with no paid tiers or locked features, built and maintained in the open by the community.</p>
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-6 xl:col-span-3 flex justify-center">
                        <div v-animateonscroll.once="{ enterClass: 'animate-fadein' }" class="box p-6 w-full animate-duration-500">
                            <img src="https://primefaces.org/cdn/primevue/images/landing/features/icon-mobile.svg" alt="components icon" class="block mb-4" />
                            <div class="font-semibold mb-4 text-lg">Mobile</div>
                            <p class="m-0 text-surface-500 dark:text-surface-400 font-medium">First class support for responsive design led by touch optimized elements.</p>
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-6 xl:col-span-3 flex justify-center">
                        <div v-animateonscroll.once="{ enterClass: 'animate-fadein' }" class="box p-6 w-full animate-duration-500">
                            <img src="https://primefaces.org/cdn/primevue/images/landing/features/icon-productivity.svg" alt="components icon" class="block mb-4" />
                            <div class="font-semibold mb-4 text-lg">Nuxt Ready</div>
                            <p class="m-0 text-surface-500 dark:text-surface-400 font-medium">First-class Nuxt module with auto-imports so you can get a project up and running in minutes.</p>
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-6 xl:col-span-3 flex justify-center">
                        <div v-animateonscroll.once="{ enterClass: 'animate-fadein' }" class="box p-6 w-full animate-duration-500">
                            <img src="https://primefaces.org/cdn/primevue/images/landing/features/icon-ts.svg" alt="components icon" class="block mb-4" />
                            <div class="font-semibold mb-4 text-lg">Typescript</div>
                            <p class="m-0 text-surface-500 dark:text-surface-400 font-medium">Top-notch support for Typescript with types and tooling assistance.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
