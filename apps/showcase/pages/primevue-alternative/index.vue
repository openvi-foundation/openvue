<template>
    <DocSeo
        title="PrimeVue Alternative | OpenVue, the MIT Fork of PrimeVue 4"
        description="Keep your PrimeVue 4 code and the MIT license. OpenVue is the maintained fork with the same API, a stable 1.0, regular fixes and a one-command migration."
        :json-ld="jsonLd"
    />
    <div class="doc">
        <div class="doc-main">
            <div class="doc-intro">
                <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div class="flex-1">
                        <h1>PrimeVue Alternative</h1>
                        <p>
                            PrimeVue 5 ships under a commercial license, and PrimeVue 4 now gets security fixes only. OpenVue keeps the PrimeVue 4 line alive with the same components and API, MIT licensed and actively maintained. Your code stays as
                            it is.
                        </p>
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
import WhyDoc from '@/doc/primevue-alternative/WhyDoc.vue';
import ShippedDoc from '@/doc/primevue-alternative/ShippedDoc.vue';
import TryDoc from '@/doc/primevue-alternative/TryDoc.vue';
import CompatibilityDoc from '@/doc/primevue-alternative/CompatibilityDoc.vue';
import OptionsDoc from '@/doc/primevue-alternative/OptionsDoc.vue';
import LongevityDoc from '@/doc/primevue-alternative/LongevityDoc.vue';
import FaqDoc from '@/doc/primevue-alternative/FaqDoc.vue';
import NoticeDoc from '@/doc/primevue-alternative/NoticeDoc.vue';
import { faqJsonLd } from '@/doc/primevue-alternative/faq.js';

export default {
    components: { DocCopyMarkdown },
    data() {
        return {
            jsonLd: faqJsonLd,
            docs: [
                {
                    id: 'why',
                    label: 'Why Teams Switch',
                    component: WhyDoc
                },
                {
                    id: 'shipped',
                    label: 'Shipped Since the Fork',
                    component: ShippedDoc
                },
                {
                    id: 'try',
                    label: 'Try It Without Risk',
                    component: TryDoc
                },
                {
                    id: 'compatibility',
                    label: 'What Changes',
                    component: CompatibilityDoc
                },
                {
                    id: 'options',
                    label: 'Compare Your Options',
                    component: OptionsDoc
                },
                {
                    id: 'longevity',
                    label: 'Will OpenVue Last?',
                    component: LongevityDoc
                },
                {
                    id: 'faq',
                    label: 'FAQ',
                    component: FaqDoc
                },
                {
                    id: 'notice',
                    label: 'Trademark Notice',
                    component: NoticeDoc
                }
            ]
        };
    }
};
</script>
