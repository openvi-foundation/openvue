<template>
    <aside class="layout-sidebar">
        <nav>
            <ol class="layout-menu">
                <AppMenuItem :menu="menu"></AppMenuItem>
            </ol>
        </nav>
    </aside>
</template>

<script>
import menudata from '@/assets/menu/menu.json';
import AppMenuItem from './AppMenuItem.vue';
export default {
    data() {
        return {
            menu: menudata.data
        };
    },
    computed: {
        darkTheme() {
            return this.$appState.darkTheme === true;
        }
    },
    components: {
        AppMenuItem
    }
};
</script>
