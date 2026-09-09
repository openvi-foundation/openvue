<template>
    <div>
        <Head>
            <Title>Theme Designer - OpenVue</Title>
            <Meta name="description" content="Design a theme visually and export it as ready-to-use code. Free, MIT-licensed, and entirely local." />
        </Head>

        <div class="doc">
            <div class="doc-main">
                <div class="doc-intro">
                    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div class="flex-1">
                            <h1>Theme Designer</h1>
                            <p>Design a theme visually and export it as ready-to-use code. Free, MIT-licensed, and entirely local.</p>
                        </div>
                        <DocCopyMarkdown docType="page" class="flex-shrink-0" />
                    </div>
                    <button type="button" class="btn-design" @click="openDesigner">Open the Designer</button>
                </div>
                <DocSections :docs="docs" />
            </div>
            <DocSectionNav :docs="docs" />
        </div>
    </div>
</template>

<script>
import DocCopyMarkdown from '@/components/doc/DocCopyMarkdown.vue';
import EditorDoc from '@/doc/designer/EditorDoc.vue';
import ExportDoc from '@/doc/designer/ExportDoc.vue';
import MigrationDoc from '@/doc/designer/MigrationDoc.vue';
import OverviewDoc from '@/doc/designer/OverviewDoc.vue';
import PrivacyDoc from '@/doc/designer/PrivacyDoc.vue';

export default {
    components: {
        DocCopyMarkdown
    },
    data() {
        return {
            docs: [
                { id: 'overview', label: 'Overview', component: OverviewDoc },
                { id: 'editor', label: 'Visual Editor', component: EditorDoc },
                { id: 'export', label: 'Export and Sharing', component: ExportDoc },
                { id: 'migration', label: 'Migration Assistant', component: MigrationDoc },
                { id: 'privacy', label: 'Privacy and Storage', component: PrivacyDoc }
            ]
        };
    },
    methods: {
        openDesigner() {
            this.$appState.designer.active = true;
        }
    }
};
</script>
