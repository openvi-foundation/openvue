<template>
    <aside ref="sidebar" class="layout-sidebar">
        <nav aria-label="Documentation">
            <div v-for="group in menu" :key="group.name" class="menu-group">
                <OpenVueNuxtLink v-if="group.to" :to="group.to" :class="['menu-group-link', { 'is-active': isActive(group.to) }]" :aria-current="isActive(group.to) ? 'page' : null">
                    {{ group.name }}
                </OpenVueNuxtLink>

                <template v-else>
                    <button type="button" class="menu-group-toggle" :aria-expanded="!isCollapsed(group)" :aria-controls="groupId(group)" @click="toggle(group)">
                        <span>{{ group.name }}</span>
                        <i class="pi pi-chevron-down" aria-hidden="true"></i>
                    </button>

                    <ul v-show="!isCollapsed(group)" :id="groupId(group)" class="menu-list">
                        <li v-if="group.overviewRoute">
                            <OpenVueNuxtLink :to="group.overviewRoute" :class="['menu-link', { 'is-active': isActive(group.overviewRoute) }]" :aria-current="isActive(group.overviewRoute) ? 'page' : null">Overview</OpenVueNuxtLink>
                        </li>
                        <li v-for="item in group.children" :key="item.name" :class="{ 'menu-subgroup': item.children }">
                            <template v-if="item.children">
                                <span class="menu-subgroup-label">{{ item.name }}</span>
                                <ul class="menu-list">
                                    <li v-for="leaf in item.children" :key="leaf.name">
                                        <a v-if="leaf.href" :href="leaf.href" class="menu-link" target="_blank" rel="noopener noreferrer">
                                            <span>{{ leaf.name }}</span>
                                            <i class="pi pi-arrow-up-right" aria-hidden="true"></i>
                                            <span class="sr-only">(opens in a new tab)</span>
                                        </a>
                                        <OpenVueNuxtLink v-else :to="leaf.to" :class="['menu-link', { 'is-active': isActive(leaf.to) }]" :aria-current="isActive(leaf.to) ? 'page' : null">
                                            <span>{{ leaf.name }}</span>
                                            <span v-if="leaf.badge" class="menu-badge">{{ leaf.badge }}</span>
                                        </OpenVueNuxtLink>
                                    </li>
                                </ul>
                            </template>
                            <a v-else-if="item.href" :href="item.href" class="menu-link" target="_blank" rel="noopener noreferrer">
                                <span>{{ item.name }}</span>
                                <i class="pi pi-arrow-up-right" aria-hidden="true"></i>
                                <span class="sr-only">(opens in a new tab)</span>
                            </a>
                            <OpenVueNuxtLink v-else :to="item.to" :class="['menu-link', { 'is-active': isActive(item.to) }]" :aria-current="isActive(item.to) ? 'page' : null">
                                <span>{{ item.name }}</span>
                                <span v-if="item.badge" class="menu-badge">{{ item.badge }}</span>
                            </OpenVueNuxtLink>
                        </li>
                    </ul>
                </template>
            </div>
        </nav>
    </aside>
</template>

<script>
import menudata from '@/assets/menu/menu.json';

/* Groups long enough to bury everything below them start closed, unless the reader is inside one.
   Every other group stays open so the whole map of the docs is visible without clicking. */
const COLLAPSIBLE_BY_DEFAULT = ['Components'];

const normalize = (path) => (path && path.length > 1 ? path.replace(/\/$/, '') : path);

const containsRoute = (group, path) => {
    if (normalize(group.overviewRoute) === path || normalize(group.to) === path) return true;

    return (group.children || []).some((child) => containsRoute(child, path));
};

export default {
    data() {
        return {
            menu: menudata.data,
            /* Explicit choices made by the reader in this session, keyed by group name. */
            toggled: {}
        };
    },
    computed: {
        currentPath() {
            return normalize(this.$route.path);
        }
    },
    watch: {
        currentPath() {
            this.$nextTick(() => this.revealActive('nearest'));
        }
    },
    mounted() {
        this.revealActive('center');
    },
    methods: {
        isActive(to) {
            return normalize(to) === this.currentPath;
        },
        groupId(group) {
            return `menu-group-${group.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        },
        isCollapsed(group) {
            if (group.name in this.toggled) return this.toggled[group.name];

            return COLLAPSIBLE_BY_DEFAULT.includes(group.name) && !containsRoute(group, this.currentPath);
        },
        toggle(group) {
            this.toggled = { ...this.toggled, [group.name]: !this.isCollapsed(group) };
        },
        /* Scrolls only the sidebar itself, never the page, so landing on a deep link keeps the reader's place. */
        revealActive(block) {
            const sidebar = this.$refs.sidebar;
            const active = sidebar?.querySelector('.is-active');

            if (!sidebar || !active) return;

            const top = active.getBoundingClientRect().top - sidebar.getBoundingClientRect().top + sidebar.scrollTop;
            const bottom = top + active.offsetHeight;
            const visibleTop = sidebar.scrollTop;
            const visibleBottom = visibleTop + sidebar.clientHeight;

            if (block === 'center') {
                sidebar.scrollTop = top - sidebar.clientHeight / 2 + active.offsetHeight / 2;
            } else if (top < visibleTop || bottom > visibleBottom) {
                sidebar.scrollTop = top - sidebar.clientHeight / 3;
            }
        }
    }
};
</script>
