<template>
    <div ref="container" class="layout-topbar">
        <div class="layout-topbar-inner">
            <div class="layout-topbar-logo-container">
                <PrimeVueNuxtLink to="/" class="layout-topbar-logo" aria-label="OpenVolt logo">
                    <svg width="132" height="40" viewBox="0 0 132 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-10 w-auto">
                        <g transform="translate(0 11) scale(0.0433)">
                            <path
                                d="M222 415.5C179 415.5 140.75 406.5 107.25 388.5C74.25 370.5 48 346 28.5 315C9.5 283.5 0 247.75 0 207.75C0 167.25 9.5 131.5 28.5 100.5C48 69 74.25 44.5 107.25 27C140.75 9 179 0 222 0C264.5 0 302.5 9 336 27C369.5 44.5 395.75 68.75 414.75 99.75C433.75 130.75 443.25 166.75 443.25 207.75C443.25 247.75 433.75 283.5 414.75 315C395.75 346 369.5 370.5 336 388.5C302.5 406.5 264.5 415.5 222 415.5ZM222 319.5C241.5 319.5 259 315 274.5 306C290 297 302.25 284.25 311.25 267.75C320.25 250.75 324.75 230.75 324.75 207.75C324.75 184.25 320.25 164.25 311.25 147.75C302.25 131.25 290 118.5 274.5 109.5C259 100.5 241.5 96 222 96C202.5 96 185 100.5 169.5 109.5C154 118.5 141.5 131.25 132 147.75C123 164.25 118.5 184.25 118.5 207.75C118.5 230.75 123 250.75 132 267.75C141.5 284.25 154 297 169.5 306C185 315 202.5 319.5 222 319.5Z"
                                fill="var(--p-primary-color)"
                            />
                            <path d="M586.42 411L416 5H537.406L679.171 354.401H618.845L765.889 5H879L707.826 411H586.42Z" fill="var(--p-primary-color)" />
                            <path d="M879.12 6L709.05 410H597L620.67 353.68H620.65L651.17 281.05L766.74 6H879.12Z" fill="var(--p-primary-400)" />
                        </g>
                        <text x="44" y="27" font-family="Inter, sans-serif" font-size="19" font-weight="600" letter-spacing="-0.4" fill="var(--p-text-color)">OpenVolt</text>
                    </svg>
                </PrimeVueNuxtLink>
            </div>

            <ul class="topbar-items">
                <li>
                    <a href="https://github.com/openvi-foundation/openvue/tree/master/apps/volt/volt" target="_blank" rel="noopener noreferrer" class="topbar-item">
                        <i class="pi pi-github"></i>
                    </a>
                </li>
                <li>
                    <a href="https://github.com/orgs/openvi-foundation/discussions" target="_blank" rel="noopener noreferrer" class="topbar-item">
                        <i class="pi pi-comments"></i>
                    </a>
                </li>
                <li>
                    <button type="button" class="topbar-item" @click="toggleDarkMode">
                        <i :class="['pi', { 'pi-moon': layoutState.darkTheme, 'pi-sun': !layoutState.darkTheme }]"></i>
                    </button>
                </li>
                <li class="relative">
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                        type="button"
                        class="topbar-item config-item"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <AppConfigurator />
                </li>
                <li class="menu-button" v-if="showMenuButton">
                    <button type="button" class="topbar-item" @click="onMenuButtonClick" aria-haspopup aria-label="Menu">
                        <i class="pi pi-bars"></i>
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const emit = defineEmits(['menubutton-click']);

defineProps({
    showMenuButton: {
        type: Boolean,
        default: true
    }
});

const { layoutState, darkModeToggleListener } = useLayout();

const container = ref(null);
let scrollListener = null;

const onMenuButtonClick = (event) => {
    emit('menubutton-click', event);
};

const toggleDarkMode = () => {
    darkModeToggleListener();
};

const bindScrollListener = () => {
    if (!scrollListener) {
        if (container.value) {
            scrollListener = () => {
                if (window.scrollY > 0) container.value.classList.add('layout-topbar-sticky');
                else container.value.classList.remove('layout-topbar-sticky');
            };
        }
    }

    window.addEventListener('scroll', scrollListener);
};

const unbindScrollListener = () => {
    if (scrollListener) {
        window.removeEventListener('scroll', scrollListener);
        scrollListener = null;
    }
};

onMounted(() => {
    bindScrollListener();
});

onBeforeUnmount(() => {
    if (scrollListener) {
        unbindScrollListener();
    }
});
</script>
