<template>
    <section class="landing-footer pt-20 px-8 lg:px-20">
        <div class="landing-footer-container">
            <div class="flex flex-wrap z-10">
                <div class="w-6/12 lg:w-3/12 flex">
                    <ul class="list-none p-0 m-0">
                        <li class="font-bold mb-8">General</li>
                        <li class="mb-6">
                            <OpenVueNuxtLink to="/setup" class="text-surface-500 dark:text-surface-400 font-medium hover:text-primary rounded transition-all duration-300">Get Started</OpenVueNuxtLink>
                        </li>
                    </ul>
                </div>
                <div class="w-6/12 lg:w-3/12 flex">
                    <ul class="list-none p-0 m-0">
                        <li class="font-bold mt-8 lg:mt-0 mb-8">Theming</li>
                        <li class="mb-6">
                            <OpenVueNuxtLink to="/theming/styled" class="text-surface-500 dark:text-surface-400 font-medium hover:text-primary rounded transition-all duration-300">Styled Mode</OpenVueNuxtLink>
                        </li>
                        <li class="mb-6">
                            <OpenVueNuxtLink to="/theming/unstyled" class="text-surface-500 dark:text-surface-400 font-medium hover:text-primary rounded transition-all duration-300">Unstyled Mode</OpenVueNuxtLink>
                        </li>
                    </ul>
                </div>
                <div class="w-6/12 lg:w-3/12 flex">
                    <ul class="list-none p-0 m-0">
                        <li class="font-bold mt-8 lg:mt-0 mb-8">Resources</li>
                        <li class="mb-6">
                            <a href="https://github.com/openvi-foundation/openvue" class="text-surface-500 dark:text-surface-400 font-medium hover:text-primary rounded transition-all duration-300" target="_blank" rel="noopener noreferrer">Source Code</a>
                        </li>
                    </ul>
                </div>
            </div>

            <hr class="section-divider" />

            <div class="flex flex-wrap justify-between py-12 gap-8">
                <span>
                    <svg width="150" height="40" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 120px">
                        <text x="0" y="28" font-family="'Segoe UI', Helvetica, Arial, sans-serif" font-weight="700" font-size="24" fill="var(--high-contrast-text-color)">Open<tspan fill="var(--logo-color)">Vue</tspan></text>
                    </svg>
                </span>
                <div class="flex items-center gap-2">
                    <a href="https://github.com/openvi-foundation/openvue" class="linkbox linkbox-icon">
                        <i class="pi pi-github"></i>
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {};
</script>
