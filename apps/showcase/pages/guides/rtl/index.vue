<template>
    <Head>
        <Title>RTL - OpenVue</Title>
        <Meta name="description" content="Right-to-Left direction support of OpenVue." />
    </Head>
    <div class="doc">
        <div class="doc-main">
            <div class="doc-intro">
                <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div class="flex-1">
                        <h1>RTL Support</h1>
                        <p>Right-to-left direction support of OpenVue.</p>
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
import ConfigurationDoc from '@/doc/guides/rtl/ConfigurationDoc.vue';
import LimitationsDoc from '@/doc/guides/rtl/LimitationsDoc.vue';

export default {
    components: { DocCopyMarkdown },
    data() {
        return {
            docs: [
                {
                    id: 'configuration',
                    label: 'Configuration',
                    component: ConfigurationDoc
                },
                {
                    id: 'tailwindcss',
                    label: 'Limitations',
                    component: LimitationsDoc
                }
            ]
        };
    }
};
</script>
