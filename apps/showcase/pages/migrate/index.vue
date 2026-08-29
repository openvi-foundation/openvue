<template>
    <DocSeo
        title="Migrate from PrimeVue to OpenVue - One Command"
        description="PrimeVue v4 is the last open source release. @openvue/migrate rewrites your imports and package references to OpenVue in one command, with no API changes."
        :json-ld="jsonLd"
    />
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
import FaqDoc from '@/doc/migrate/FaqDoc.vue';
import { faqJsonLd } from '@/doc/migrate/faq.js';

export default {
    components: { DocCopyMarkdown },
    data() {
        return {
            jsonLd: faqJsonLd,
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
                },
                {
                    id: 'faq',
                    label: 'FAQ',
                    component: FaqDoc
                }
            ]
        };
    }
};
</script>
