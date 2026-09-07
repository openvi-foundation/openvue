<template>
    <div>
        <DocSeo title="OpenIcons - OpenVue" description="OpenIcons is the default icon library of OpenVue, a community-maintained continuation of PrimeIcons shipping 323 icons as a webfont and as tree-shakeable Vue components." />

        <div class="doc">
            <div class="doc-main">
                <div class="doc-intro">
                    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div class="flex-1">
                            <h1>Icons</h1>
                            <p>
                                <a href="https://github.com/openvi-foundation/openicons" target="_blank" rel="noopener noreferrer">OpenIcons</a>
                                is the default icon library of OpenVue, a community-maintained continuation of PrimeIcons with 323 icons. It is optional as OpenVue components can use any icon with templating.
                            </p>
                        </div>
                        <DocCopyMarkdown docType="page" class="flex-shrink-0" />
                    </div>
                </div>
                <DocSections :docs="docs" />
            </div>
            <DocSectionNav :docs="docs" />
        </div>
    </div>
</template>

<script>
import DocCopyMarkdown from '@/components/doc/DocCopyMarkdown.vue';
import CompatibilityDoc from '@/doc/icons/CompatibilityDoc.vue';
import ComponentsDoc from '@/doc/icons/ComponentsDoc.vue';
import ConstantsDoc from '@/doc/icons/ConstantsDoc.vue';
import DownloadDoc from '@/doc/icons/DownloadDoc.vue';
import ImportDoc from '@/doc/icons/ImportDoc.vue';
import ListDoc from '@/doc/icons/ListDoc.vue';
import WebfontDoc from '@/doc/icons/WebfontDoc.vue';

export default {
    components: { DocCopyMarkdown },
    data() {
        return {
            docs: [
                {
                    id: 'download',
                    label: 'Download',
                    component: DownloadDoc
                },
                {
                    id: 'import',
                    label: 'Import',
                    component: ImportDoc
                },
                {
                    id: 'webfont',
                    label: 'Webfont',
                    component: WebfontDoc
                },
                {
                    id: 'components',
                    label: 'Vue Components',
                    component: ComponentsDoc
                },
                {
                    id: 'constants',
                    label: 'Constants',
                    component: ConstantsDoc
                },
                {
                    id: 'compatibility',
                    label: 'Migration from PrimeIcons',
                    component: CompatibilityDoc
                },
                {
                    id: 'list',
                    label: 'List',
                    component: ListDoc
                }
            ]
        };
    }
};
</script>
