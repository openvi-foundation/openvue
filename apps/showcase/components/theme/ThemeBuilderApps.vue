<template>
    <div class="theme-builder-apps">
        <div class="theme-builder-apps-nav" role="tablist" aria-label="Sample applications">
            <button v-for="app of apps" :key="app.id" type="button" role="tab" :aria-selected="active === app.id" :class="['theme-builder-apps-tab', { 'theme-builder-apps-tab-active': active === app.id }]" @click="active = app.id">
                <i :class="app.icon" aria-hidden="true"></i>
                <span>{{ app.label }}</span>
            </button>
        </div>
        <div class="theme-builder-apps-frame">
            <LazyOverviewApp v-if="active === 'overview'" />
            <LazyCustomersApp v-else-if="active === 'customers'" />
            <LazyInboxApp v-else-if="active === 'inbox'" />
            <LazyChatApp v-else-if="active === 'chat'" />
            <LazyCardsApp v-else-if="active === 'cards'" />
            <LazyMoviesApp v-else-if="active === 'movies'" />
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            active: 'overview',
            apps: [
                { id: 'overview', label: 'Dashboard', icon: 'pi pi-chart-bar' },
                { id: 'customers', label: 'Customers', icon: 'pi pi-users' },
                { id: 'inbox', label: 'Inbox', icon: 'pi pi-inbox' },
                { id: 'chat', label: 'Chat', icon: 'pi pi-comments' },
                { id: 'cards', label: 'Cards', icon: 'pi pi-id-card' },
                { id: 'movies', label: 'Movies', icon: 'pi pi-video' }
            ]
        };
    }
};
</script>
