<template>
    <Head>
        <Title>Migration from PrimeVue v4 - OpenVue</Title>
        <Meta name="description" content="Automated codemod for migrating a PrimeVue v4 project to OpenVue in one command." />
    </Head>
    <div class="doc">
        <div class="doc-main">
            <div class="doc-intro">
                <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div class="flex-1">
                        <h1>Migration from PrimeVue v4</h1>
                        <p>Move an existing PrimeVue v4 project to OpenVue with one command.</p>
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
import UsageDoc from '@/doc/migrate/UsageDoc.vue';
import WhatItDoesDoc from '@/doc/migrate/WhatItDoesDoc.vue';
import OptionsDoc from '@/doc/migrate/OptionsDoc.vue';
import TryDoc from '@/doc/migrate/TryDoc.vue';
import RequirementsDoc from '@/doc/migrate/RequirementsDoc.vue';

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
                    id: 'usage',
                    label: 'Usage',
                    component: UsageDoc
                },
                {
                    id: 'whatitdoes',
                    label: 'What It Does',
                    component: WhatItDoesDoc
                },
                {
                    id: 'options',
                    label: 'Options',
                    component: OptionsDoc
                },
                {
                    id: 'try',
                    label: 'Try Without Migrating',
                    component: TryDoc
                },
                {
                    id: 'requirements',
                    label: 'Requirements',
                    component: RequirementsDoc
                }
            ]
        };
    }
};
</script>
