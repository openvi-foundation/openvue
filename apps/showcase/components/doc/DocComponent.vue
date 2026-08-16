<template>
    <div :class="['doc-component', className]">
        <Head>
            <Title>{{ title }}</Title>
            <Meta name="description" :content="description" />
        </Head>

        <ul class="doc-tabmenu">
            <li v-for="item in tabs" :key="item.key" :class="{ 'doc-tabmenu-active': tab === item.key }">
                <button type="button" @click="tab = item.key">
                    <span class="inline-flex items-center gap-2">
                        {{ item.label }}
                        <Tag v-if="item.isNew" value="New" severity="success" />
                    </span>
                </button>
            </li>
        </ul>

        <div class="doc-tabpanels">
            <div v-show="tab === 'features'" class="doc-tabpanel">
                <div class="doc-main">
                    <div class="doc-intro">
                        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                            <div class="flex-1">
                                <h1>{{ header }}</h1>
                                <p>{{ description }}</p>
                            </div>
                            <DocCopyMarkdown :componentName="getComponentName()" class="flex-shrink-0" />
                        </div>
                    </div>
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
                { key: 'features', label: 'FEATURES' },
                { key: 'playground', label: 'PLAYGROUND', when: this.playgroundDocs },
                { key: 'api', label: 'API' },
                { key: 'theming', label: 'THEMING', when: this.themingDocs },
                { key: 'pt', label: 'PASS THROUGH', when: this.ptTabComponent }
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
