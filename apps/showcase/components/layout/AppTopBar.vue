<template>
    <div :ref="containerRef" class="layout-topbar">
        <div class="layout-topbar-inner">
            <div class="layout-topbar-logo-container">
                <OpenVueNuxtLink to="/" class="layout-topbar-logo" aria-label="OpenVue logo">
                    <img src="/open_vue_logo.svg" alt="OpenVue" width="66" height="31" />
                </OpenVueNuxtLink>
                <OpenVueNuxtLink to="/" class="layout-topbar-icon" aria-label="OpenVue logo">
                    <img src="/open_vue_logo.svg" alt="OpenVue" width="53" height="25" />
                </OpenVueNuxtLink>
            </div>

            <ul class="topbar-items">
                <li>
                    <button type="button" class="topbar-item search-item" aria-label="Search" @click="openSearch">
                        <i class="pi pi-search"></i>
                        <span class="search-item-label">Search</span>
                        <span class="search-item-hint" aria-hidden="true">⌘K</span>
                    </button>
                </li>
                <li>
                    <a href="https://github.com/openvi-foundation/openvue" target="_blank" rel="noopener noreferrer" class="topbar-item">
                        <i class="pi pi-github"></i>
                    </a>
                </li>
                <li>
                    <button type="button" class="topbar-item" @click="toggleDarkMode">
                        <i :class="['pi', { 'pi-moon': $appState.darkTheme, 'pi-sun': !$appState.darkTheme }]"></i>
                    </button>
                </li>
                <li>
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'px-overlay-enter-active', leaveToClass: 'hidden', leaveActiveClass: 'px-overlay-leave-active', hideOnOutsideClick: true }"
                        type="button"
                        class="topbar-item config-item"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <AppConfigurator />
                </li>
                <li v-if="showMenuButton" class="menu-button">
                    <button type="button" class="topbar-item menu-button" @click="onMenuButtonClick" aria-haspopup aria-label="Menu">
                        <i class="pi pi-bars"></i>
                    </button>
                </li>
            </ul>
        </div>
        <AppSearch />
    </div>
</template>

<script>
import EventBus from '@/app/AppEventBus';

export default {
    emits: ['menubutton-click'],
    outsideClickListener: null,
    props: {
        showMenuButton: {
            type: Boolean,
            default: true
        }
    },
    scrollListener: null,
    container: null,
    mounted() {
        this.bindScrollListener();
    },
    beforeUnmount() {
        if (this.scrollListener) {
            this.unbindScrollListener();
        }
    },
    methods: {
        onMenuButtonClick(event) {
            this.$emit('menubutton-click', event);
        },
        openSearch() {
            EventBus.emit('open-search');
        },
        toggleDarkMode() {
            EventBus.emit('dark-mode-toggle', { dark: !this.$appState.darkTheme });
        },
        bindScrollListener() {
            if (!this.scrollListener) {
                if (this.container) {
                    this.scrollListener = () => {
                        if (window.scrollY > 0) this.container.classList.add('layout-topbar-sticky');
                        else this.container.classList.remove('layout-topbar-sticky');
                    };
                }
            }

            window.addEventListener('scroll', this.scrollListener);
        },
        unbindScrollListener() {
            if (this.scrollListener) {
                window.removeEventListener('scroll', this.scrollListener);
                this.scrollListener = null;
            }
        },
        bindOutsideClickListener() {
            if (!this.outsideClickListener) {
                this.outsideClickListener = (event) => {
                    if (this.isOutsideTopbarMenuClicked(event)) {
                        this.unbindOutsideClickListener();
                    }
                };

                document.addEventListener('click', this.outsideClickListener);
            }
        },
        unbindOutsideClickListener() {
            if (this.outsideClickListener) {
                document.removeEventListener('click', this.outsideClickListener);
                this.outsideClickListener = null;
            }
        },
        isOutsideTopbarMenuClicked(event) {
            return !(this.$refs.topbarMenu.isSameNode(event.target) || this.$refs.topbarMenu.contains(event.target));
        },
        containerRef(el) {
            this.container = el;
        }
    }
};
</script>
