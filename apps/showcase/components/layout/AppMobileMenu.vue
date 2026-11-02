<template>
    <Drawer :visible="visible" position="left" class="mobile-menu" aria-label="Site navigation" :blockScroll="true" :showCloseIcon="false" @update:visible="onVisibleChange" @after-show="scrollToActive">
        <template #header>
            <div class="mobile-menu-header">
                <Button v-if="panel !== 'root'" icon="pi pi-chevron-left" label="Menu" text severity="secondary" class="mobile-menu-back" @click="showPanel('root')" />
                <OpenVueNuxtLink v-else to="/" class="mobile-menu-logo" aria-label="OpenVue home">
                    <img src="/open_vue_logo.svg" alt="OpenVue" width="66" height="31" />
                </OpenVueNuxtLink>
                <span class="mobile-menu-title">{{ panelTitle }}</span>
                <Button icon="pi pi-times" text rounded severity="secondary" aria-label="Close menu" class="mobile-menu-close" @click="close" />
            </div>
        </template>

        <div ref="body" class="mobile-menu-body" @click="onBodyClick">
            <Transition :name="`mobile-menu-${direction}`" mode="out-in" @after-enter="scrollToActive">
                <nav v-if="panel === 'root'" key="root" aria-label="Primary">
                    <Button icon="pi pi-search" label="Search" severity="secondary" variant="outlined" fluid class="mobile-menu-search" @click="openSearch" />

                    <ol class="layout-menu">
                        <li v-for="section of sections" :key="section.label">
                            <button v-if="section.panel" type="button" @click="showPanel(section.panel)">
                                <span class="menu-icon">
                                    <i :class="section.icon"></i>
                                </span>
                                <span>{{ section.label }}</span>
                                <span class="menu-toggle">
                                    <i class="menu-toggle-icon pi pi-angle-right"></i>
                                </span>
                            </button>
                            <a v-else-if="section.href" :href="section.href" target="_blank" rel="noopener noreferrer">
                                <span class="menu-icon">
                                    <i :class="section.icon"></i>
                                </span>
                                <span>{{ section.label }}</span>
                                <span class="menu-toggle">
                                    <i class="menu-toggle-icon pi pi-external-link"></i>
                                </span>
                            </a>
                            <OpenVueNuxtLink v-else :to="section.to">
                                <span class="menu-icon">
                                    <i :class="section.icon"></i>
                                </span>
                                <span>{{ section.label }}</span>
                            </OpenVueNuxtLink>
                        </li>
                    </ol>

                    <ol v-if="moreGroup" class="layout-menu mobile-menu-more">
                        <li>
                            <div>
                                <ol>
                                    <AppMenuItem :root="false" :menu="[moreGroup]" />
                                </ol>
                            </div>
                        </li>
                    </ol>
                </nav>

                <nav v-else :key="panel" :aria-label="panelTitle">
                    <template v-if="panel === 'components'">
                        <ol class="layout-menu">
                            <li>
                                <OpenVueNuxtLink to="/components">
                                    <span class="menu-icon">
                                        <i class="pi pi-th-large"></i>
                                    </span>
                                    <span>Browse the gallery</span>
                                </OpenVueNuxtLink>
                            </li>
                        </ol>
                        <IconField class="mobile-menu-filter">
                            <InputIcon class="pi pi-filter" />
                            <InputText v-model="filter" type="search" placeholder="Filter components" aria-label="Filter components" autocomplete="off" fluid />
                        </IconField>
                    </template>

                    <ol v-if="panelGroups.length" class="layout-menu">
                        <li>
                            <div>
                                <ol>
                                    <AppMenuItem :root="false" :menu="panelGroups" />
                                </ol>
                            </div>
                        </li>
                    </ol>
                    <p v-else class="mobile-menu-empty">No components match “{{ filter }}”.</p>
                </nav>
            </Transition>
        </div>
    </Drawer>
</template>

<script>
import menudata from '@/assets/menu/menu.json';
import EventBus from '@/app/AppEventBus';
import AppMenuItem from './AppMenuItem.vue';
import OpenVueNuxtLink from './OpenVueNuxtLink';

const componentsGroup = menudata.data.find((item) => item.overviewRoute === '/components');
const moreGroup = menudata.data.find((item) => item.name === 'Discover');
const docsGroups = menudata.data.filter((item) => item !== componentsGroup && item !== moreGroup && !item.href);

export default {
    components: {
        AppMenuItem,
        OpenVueNuxtLink
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        sections: {
            type: Array,
            default: () => []
        }
    },
    emits: ['close'],
    data() {
        return {
            moreGroup,
            panel: 'root',
            direction: 'forward',
            filter: ''
        };
    },
    watch: {
        visible(value) {
            if (value) {
                this.direction = 'forward';
                this.panel = this.currentPanel();
                this.filter = '';
            }
        },
        $route() {
            this.close();
        }
    },
    computed: {
        panelTitle() {
            return this.sections.find((section) => section.panel === this.panel)?.label ?? '';
        },
        panelGroups() {
            if (this.panel === 'docs') return docsGroups;

            const query = this.filter.trim().toLowerCase();

            if (!query) return componentsGroup.children;

            return componentsGroup.children.map((group) => ({ ...group, children: group.children.filter((item) => item.name.toLowerCase().includes(query)) })).filter((group) => group.children.length);
        }
    },
    methods: {
        close() {
            this.$emit('close');
        },
        onVisibleChange(value) {
            if (!value) this.close();
        },
        showPanel(panel) {
            this.direction = panel === 'root' ? 'back' : 'forward';
            this.panel = panel;
            this.filter = '';
            this.$refs.body.closest('.p-drawer-content').scrollTop = 0;
        },
        currentPanel() {
            const contains = (items) => items.some((item) => item.to === this.$route.path || (item.children && contains(item.children)));

            if (this.$route.path === '/components' || contains(componentsGroup.children)) return 'components';
            if (contains(docsGroups)) return 'docs';

            return 'root';
        },
        openSearch() {
            this.close();
            EventBus.emit('open-search');
        },
        onBodyClick(event) {
            if (event.target.closest('a')) this.close();
        },
        scrollToActive() {
            this.$refs.body?.querySelector('.layout-menu ol .router-link-active')?.scrollIntoView({ block: 'center' });
        }
    }
};
</script>
