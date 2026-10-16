<template>
    <div>
        <Head>
            <Title>Overview - OpenVolt</Title>
            <Meta name="description" content="OpenVolt is a UI component library crafted with Unstyled OpenVue Core and Tailwind CSS." />
        </Head>

        <div class="doc">
            <div class="doc-main">
                <div class="doc-intro">
                    <h1>Overview</h1>
                    <p>OpenVolt is a UI component library crafted with Unstyled OpenVue Core and Tailwind CSS.</p>
                </div>
                <DocSections :docs="docs" />
            </div>
            <DocSectionNav :docs="docs" />
        </div>
    </div>
</template>

<script setup lang="ts">
import ComparisonDoc from '@/doc/overview/ComparisonDoc.vue';
import CustomizationDoc from '@/doc/overview/CustomizationDoc.vue';
import MigrationDoc from '@/doc/overview/MigrationDoc.vue';
import WhatIsVoltDoc from '@/doc/overview/WhatIsVoltDoc.vue';
import TWMergeDoc from '@/doc/overview/TWMergeDoc.vue';
import { ref } from 'vue';

const docs = ref([
    {
        id: 'whatisvolt',
        label: 'What is OpenVolt?',
        component: WhatIsVoltDoc
    },
    {
        id: 'comparison',
        label: 'Comparison',
        component: ComparisonDoc
    },
    {
        id: 'migration',
        label: 'Migrating from Volt',
        component: MigrationDoc
    },
    {
        id: 'customization',
        label: 'Customization',
        component: CustomizationDoc
    },
    {
        id: 'twmerge',
        label: 'tw-merge',
        component: TWMergeDoc
    }
]);
</script>
