<template>
    <div>
        <DocSeo title="About OpenVue | Maintained by the OpenVi Foundation" description="OpenVue is the MIT-licensed continuation of PrimeVue 4, maintained in the open by the OpenVi Foundation alongside OpenUXKit, OpenIcons and OpenVolt." />

        <div class="doc">
            <div class="doc-main alt-page">
                <div class="doc-intro">
                    <h1>About OpenVue</h1>
                    <p>
                        OpenVue is maintained by the <a href="https://openvi.dev" target="_blank" rel="noopener noreferrer" class="doc-link">OpenVi Foundation</a>, an independent, community-run organization that keeps open source UI libraries for the
                        web released, documented and MIT licensed. We are not affiliated with PrimeTek.
                    </p>

                    <div class="alt-hero-actions">
                        <Button as="a" href="https://openvi.dev/about" target="_blank" rel="noopener noreferrer" label="About the foundation" icon="pi pi-arrow-up-right" iconPos="right" />
                        <Button as="router-link" to="/contribution" label="Contribute to OpenVue" severity="secondary" variant="outlined" />
                    </div>
                </div>
                <DocSections :docs="docs" />
            </div>
            <DocSectionNav :docs="docs" />
        </div>
    </div>
</template>

<script>
import FoundationDoc from '@/doc/team/FoundationDoc.vue';
import GetInvolvedDoc from '@/doc/team/GetInvolvedDoc.vue';
import WhyDoc from '@/doc/team/WhyDoc.vue';

export default {
    data() {
        return {
            docs: [
                {
                    id: 'why',
                    label: 'Why OpenVue Exists',
                    component: WhyDoc
                },
                {
                    id: 'foundation',
                    label: 'The OpenVi Foundation',
                    component: FoundationDoc
                },
                {
                    id: 'getinvolved',
                    label: 'Get Involved',
                    component: GetInvolvedDoc
                }
            ]
        };
    }
};
</script>
