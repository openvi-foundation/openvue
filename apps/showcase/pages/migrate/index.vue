<template>
    <Head>
        <Title>Migration from PrimeVue v4 - OpenVue</Title>
        <Meta name="description" content="Automated codemod for migrating a PrimeVue v4 project to OpenVue." />
    </Head>
    <div class="doc">
        <div class="doc-main">
            <div class="doc-intro">
                <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-3">
                            <h1>Migration from PrimeVue v4</h1>
                            <Tag severity="info" value="In Development"></Tag>
                        </div>
                        <p>An automated migration path for moving an existing PrimeVue v4 project to OpenVue.</p>
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
import OverviewDoc from '@/doc/migrate/OverviewDoc.vue';

export default {
    components: { DocCopyMarkdown },
    data() {
        return {
            docs: [
                {
                    id: 'overview',
                    label: 'Overview',
                    component: OverviewDoc
                }
            ]
        };
    }
};
</script>
