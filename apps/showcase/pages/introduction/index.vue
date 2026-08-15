<template>
    <Head>
        <Title>Introduction - OpenVue</Title>
        <Meta name="description" content="The Vue UI component library, continued." />
    </Head>
    <div class="doc">
        <div class="doc-main">
            <div class="doc-intro">
                <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div class="flex-1">
                        <h1>Introduction</h1>
                        <p>The Vue UI component library, continued.</p>
                    </div>
                    <DocCopyMarkdown docType="page" class="flex-shrink-0" />
                </div>
            </div>
            <DocSections :docs="docs" />
        </div>
        <DocSectionNav :docs="docs" />
    </div>
</template>

<script>
import DocCopyMarkdown from '@/components/doc/DocCopyMarkdown.vue';
import AccessibilityDoc from '@/doc/introduction/AccessibilityDoc.vue';
import MigrationDoc from '@/doc/introduction/MigrationDoc.vue';
import OverviewDoc from '@/doc/introduction/OverviewDoc.vue';
import PassThroughDoc from '@/doc/introduction/PassThroughDoc.vue';
import ThemingDoc from '@/doc/introduction/ThemingDoc.vue';

export default {
    components: { DocCopyMarkdown },
    data() {
        return {
            docs: [
                {
                    id: 'overview',
                    label: 'Overview',
                    component: OverviewDoc
                },
                {
                    id: 'migration',
                    label: 'Migrating from PrimeVue',
                    component: MigrationDoc
                },
                {
                    id: 'theming',
                    label: 'Theming',
                    component: ThemingDoc
                },
                {
                    id: 'passthrough',
                    label: 'Pass Through',
                    component: PassThroughDoc
                },
                {
                    id: 'accessibility',
                    label: 'Accessibility',
                    component: AccessibilityDoc
                }
            ]
        };
    }
};
</script>
