<template>
    <Head>
        <Title>Introduction - OpenVue</Title>
        <Meta name="description" content="Next-generation UI Component suite for Vue." />
    </Head>
    <div class="doc">
        <div class="doc-main">
            <div class="doc-intro">
                <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div class="flex-1">
                        <h1>Introduction</h1>
                        <p>Next-generation UI Component suite for Vue.</p>
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
import AddOnsDoc from '@/doc/introduction/AddOnsDoc.vue';
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
                },
                {
                    id: 'add-ons',
                    label: 'Add-Ons',
                    component: AddOnsDoc
                }
            ]
        };
    }
};
</script>
