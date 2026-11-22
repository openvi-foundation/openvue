<template>
    <nav v-if="current" class="doc-pager" aria-label="Previous and next page">
        <OpenVueNuxtLink v-if="previous" :to="previous.to" class="doc-pager-link doc-pager-prev">
            <span class="doc-pager-direction">Previous</span>
            <span class="doc-pager-title"><i class="pi pi-arrow-left" aria-hidden="true"></i>{{ previous.name }}</span>
        </OpenVueNuxtLink>
        <OpenVueNuxtLink v-if="next" :to="next.to" class="doc-pager-link doc-pager-next">
            <span class="doc-pager-direction">Next</span>
            <span class="doc-pager-title">{{ next.name }}<i class="pi pi-arrow-right" aria-hidden="true"></i></span>
        </OpenVueNuxtLink>
    </nav>
</template>

<script>
import menudata from '@/assets/menu/menu.json';

const normalize = (path) => (path && path.length > 1 ? path.replace(/\/$/, '') : path);

/* Reading order is the sidebar order: every internal page, depth first, external links skipped. */
const flatten = (items) =>
    items.flatMap((item) => {
        const own = [];

        if (item.overviewRoute) own.push({ name: item.name, to: item.overviewRoute });
        if (item.to) own.push({ name: item.name, to: item.to });

        return [...own, ...(item.children ? flatten(item.children) : [])];
    });

const pages = flatten(menudata.data);

export default {
    computed: {
        index() {
            const path = normalize(this.$route.path);

            return pages.findIndex((page) => normalize(page.to) === path);
        },
        current() {
            return this.index > -1 ? pages[this.index] : null;
        },
        previous() {
            return this.index > 0 ? pages[this.index - 1] : null;
        },
        next() {
            return this.index > -1 && this.index < pages.length - 1 ? pages[this.index + 1] : null;
        }
    }
};
</script>
