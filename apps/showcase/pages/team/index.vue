<template>
    <div>
        <Head>
            <Title>About Us - OpenVue</Title>
            <Meta name="description" content="Openvi Foundation is a community-run organization maintaining open source UI libraries for the web. OpenVue is our continuation of PrimeVue v4, MIT licensed and free forever." />
        </Head>

        <div class="doc">
            <div class="doc-main">
                <div class="doc-intro">
                    <h1>About Us</h1>
                    <p>Openvi Foundation is an independent, community-driven organization dedicated to maintaining and evolving open source UI tooling for the Vue ecosystem. We are not affiliated with the PrimeVue team or Primetek.</p>
                </div>
                <DocSections :docs="docs" />
            </div>
            <DocSectionNav :docs="docs" />
        </div>
    </div>
</template>

<script>
import GetInvolvedDoc from '@/doc/team/GetInvolvedDoc.vue';
import IntroductionDoc from '@/doc/team/IntroductionDoc.vue';
import WhyDoc from '@/doc/team/WhyDoc.vue';

export default {
    data() {
        return {
            docs: [
                {
                    id: 'introduction',
                    label: 'Introduction',
                    component: IntroductionDoc
                },
                {
                    id: 'why',
                    label: 'Why We Continued',
                    component: WhyDoc
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
