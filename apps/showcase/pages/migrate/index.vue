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

export default {
    components: { DocCopyMarkdown },
    data() {
        return {
            /* These are the questions people actually type before they commit to a fork,
               so they are marked up for the FAQ rich result as well as answered on the page. */
            jsonLd: {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: [
                    {
                        '@type': 'Question',
                        name: 'Is OpenVue a drop-in replacement for PrimeVue?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Yes. OpenVue is a fork of PrimeVue 4.5.5 that keeps the public API unchanged: usePrimeVue, PrimeVueResolver, the primevue Nuxt config key, p- prefixed CSS classes and pass-through options all work exactly as before. Migrating is a package rename, not a rewrite.'
                        }
                    },
                    {
                        '@type': 'Question',
                        name: 'How do I migrate a PrimeVue project to OpenVue?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Run @openvue/migrate from the root of your project. It detects your package manager and PrimeVue version, shows you a plan of every file and reference it will change, and only then rewrites imports and dependencies. Monorepos, Vite, Nuxt and Laravel projects are supported, and a dry run mode writes nothing.'
                        }
                    },
                    {
                        '@type': 'Question',
                        name: 'What licence is OpenVue released under?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'OpenVue is MIT licensed. PrimeVue 4.5.5 was the last release published under an open source licence, and OpenVue continues that work in the open with bug fixes, accessibility and performance improvements, support for current Vue and Nuxt releases, and new components.'
                        }
                    },
                    {
                        '@type': 'Question',
                        name: 'Can I migrate from PrimeVue v3?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Not directly. The fork point is PrimeVue 4.x, and the tool stops without changing anything if it finds a different major. Apply the PrimeVue v4 migration guide first, then run @openvue/migrate.'
                        }
                    }
                ]
            },
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
