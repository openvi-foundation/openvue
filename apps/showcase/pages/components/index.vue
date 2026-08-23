<template>
    <Head>
        <Title>Components - OpenVue</Title>
        <Meta name="description" content="Browse all OpenVue UI components by category." />
    </Head>
    <div class="doc">
        <div class="doc-main">
            <div class="doc-intro">
                <h1>Components</h1>
                <p>{{ totalCount }} accessible, themeable components for Vue and Nuxt. Pick one to see live examples.</p>
            </div>

            <div class="components-toolbar">
                <IconField class="components-search">
                    <InputIcon class="pi pi-search" />
                    <InputText v-model="query" placeholder="Search components" aria-label="Search components" fluid />
                </IconField>
            </div>

            <Message v-if="!filteredCategories.length" severity="secondary" :closable="false">No component matches "{{ query }}".</Message>

            <section v-for="category in filteredCategories" :key="category.name" class="components-category">
                <h2 class="components-category-title">
                    <i :class="['components-category-icon', 'pi', categoryIcon(category.name)]" aria-hidden="true"></i>
                    <span>{{ category.name }}</span>
                    <Badge :value="category.items.length" severity="secondary" />
                </h2>
                <div class="components-grid">
                    <OpenVueNuxtLink v-for="item in category.items" :key="item.to" :to="item.to" class="components-card-link">
                        <Card class="components-card">
                            <template #title>{{ item.name }}</template>
                            <template #content>
                                <p class="components-card-description">{{ item.description }}</p>
                                <div v-if="previews[item.name]" class="components-card-preview" inert aria-hidden="true">
                                    <ClientOnly>
                                        <component :is="previews[item.name]" />
                                    </ClientOnly>
                                </div>
                            </template>
                        </Card>
                    </OpenVueNuxtLink>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import descriptions from '@/assets/menu/component-descriptions.json';
import menudata from '@/assets/menu/menu.json';
import previews from '@/doc/preview';

const CATEGORY_ICONS = {
    Form: 'pi-pencil',
    Button: 'pi-bolt',
    Data: 'pi-table',
    Panel: 'pi-clone',
    Overlay: 'pi-window-maximize',
    File: 'pi-upload',
    Menu: 'pi-bars',
    Messages: 'pi-comment',
    Media: 'pi-images',
    Misc: 'pi-star'
};

export default {
    data() {
        return {
            query: ''
        };
    },
    computed: {
        /* Static, non-interactive samples: `inert` keeps them out of tab order and pointer events.
           They mount client side only: 90 live components cannot all hydrate cleanly, and the
           reserved min-height means nothing shifts when they appear. */
        previews() {
            return previews;
        },
        /* The sidebar menu is the single source of truth, so a new component shows up here for free. */
        categories() {
            const components = menudata.data.find((item) => item.name === 'Components');

            return (components?.children ?? []).map((category) => ({
                name: category.name,
                items: (category.children ?? [])
                    .filter((item) => item.to)
                    .map((item) => ({
                        name: item.name,
                        to: item.to,
                        description: descriptions[item.to] ?? ''
                    }))
            }));
        },
        totalCount() {
            return this.categories.reduce((count, category) => count + category.items.length, 0);
        },
        filteredCategories() {
            const query = this.query.trim().toLowerCase();

            if (!query) return this.categories;

            return this.categories.map((category) => ({ ...category, items: category.items.filter((item) => item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)) })).filter((category) => category.items.length);
        }
    },
    methods: {
        categoryIcon(name) {
            return CATEGORY_ICONS[name] ?? 'pi-box';
        }
    }
};
</script>
