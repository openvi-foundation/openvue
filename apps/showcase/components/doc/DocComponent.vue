<template>
    <div :class="['doc-component', className]">
        <header class="doc-intro doc-component-header">
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div class="flex-1">
                    <h1>{{ header }}</h1>
                    <p>{{ description }}</p>
                    <p>Coming from PrimeVue? Compare <NuxtLink to="/primevue-alternative" class="doc-link">your options</NuxtLink> or <NuxtLink to="/migrate" class="doc-link">migrate in one command</NuxtLink>.</p>
                </div>
                <DocCopyMarkdown :componentName="getComponentName()" class="flex-shrink-0" />
            </div>
        </header>

        <ul class="doc-tabmenu" aria-label="Documentation sections">
            <li v-for="item in tabs" :key="item.key" :class="{ 'doc-tabmenu-active': tab === item.key }">
                <button type="button" :aria-current="tab === item.key ? 'true' : null" @click="tab = item.key">
                    {{ item.label }}
                    <Tag v-if="item.isNew" value="New" severity="success" class="doc-tabmenu-new" />
                </button>
            </li>
        </ul>

        <div class="doc-tabpanels">
            <div v-show="tab === 'features'" class="doc-tabpanel">
                <div class="doc-main">
                    <DocSections :docs="componentDocs" />
                </div>
                <DocSectionNav :docs="componentDocs" />
            </div>

            <div v-if="tab === 'playground'" class="doc-tabpanel">
                <component :is="{ ...playgroundDocs }" />
            </div>

            <div v-show="tab === 'api'" class="doc-tabpanel">
                <DocApiSection :doc="apiDocs" :header="header" />
            </div>

            <div v-if="tab === 'theming'" class="doc-tabpanel">
                <component :is="{ ...themingDocs }" />
            </div>

            <div v-if="tab === 'pt'" class="doc-tabpanel">
                <component :is="{ ...ptTabComponent }" />
            </div>
        </div>
    </div>
</template>

<script>
import DocCopyMarkdown from './DocCopyMarkdown.vue';

export default {
    components: {
        DocCopyMarkdown
    },
    setup(props) {
        const route = useRoute();

        /* The raw component blurb is short and reads the same for logged-out crawlers as it does
           on the page, so we extend it with the two facts a searcher is actually deciding on. */
        const metaDescription = computed(() => {
            const base = (props.description || '').trim();
            const suffix = `Free, MIT-licensed ${props.header} component for Vue 3 and Nuxt.`;

            return base ? `${base} ${suffix}` : suffix;
        });

        useSeo({
            title: props.title,
            description: metaDescription.value,
            path: route.path,
            type: 'article',
            jsonLd: {
                '@context': 'https://schema.org',
                '@graph': [
                    {
                        '@type': 'TechArticle',
                        headline: props.title,
                        description: props.description,
                        url: absoluteUrl(route.path),
                        inLanguage: 'en',
                        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
                        about: {
                            '@type': 'SoftwareSourceCode',
                            name: props.header,
                            programmingLanguage: 'JavaScript',
                            runtimePlatform: 'Vue 3',
                            codeRepository: 'https://github.com/openvi-foundation/openvue',
                            license: 'https://opensource.org/licenses/MIT'
                        }
                    },
                    {
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                            { '@type': 'ListItem', position: 1, name: 'OpenVue', item: SITE_URL },
                            { '@type': 'ListItem', position: 2, name: 'Components', item: `${SITE_URL}/components` },
                            { '@type': 'ListItem', position: 3, name: props.header, item: absoluteUrl(route.path) }
                        ]
                    }
                ]
            }
        });
    },
    props: {
        title: null,
        header: null,
        description: null,
        componentDocs: null,
        apiDocs: null,
        className: null,
        ptTabComponent: null,
        themingDocs: null,
        playgroundDocs: null,
        /* Tab keys to flag as new. The page owns this so the badge can be dropped once it isn't. */
        newTabs: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            tab: 'features'
        };
    },
    computed: {
        /* A tab appears only when the page supplied its content, and its key is also its URL hash. */
        tabs() {
            return [
                { key: 'features', label: 'Features' },
                { key: 'playground', label: 'Playground', when: this.playgroundDocs },
                { key: 'api', label: 'API' },
                { key: 'theming', label: 'Theming', when: this.themingDocs },
                { key: 'pt', label: 'Pass Through', when: this.ptTabComponent }
            ]
                .filter((item) => !('when' in item) || item.when)
                .map((item) => ({ ...item, isNew: this.newTabs.includes(item.key) }));
        }
    },
    mounted() {
        const hash = this.$route.hash;
        const match = this.tabs.find((item) => item.key !== 'features' && hash.includes(item.key));

        if (match) this.tab = match.key;
    },
    methods: {
        getComponentName() {
            // Extract component name from route
            const path = this.$route.path;
            const segments = path.split('/').filter(Boolean);
            return segments[segments.length - 1] || null;
        }
    }
};
</script>
