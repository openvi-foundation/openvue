/**
 * FAQPage structured data for /migrate.
 *
 * The prose lives in FaqDoc.vue, written out literally because the llms.txt and MCP generators
 * parse the template source rather than the rendered page. Keep the two in sync: Google will not
 * show a rich result for markup that has no matching visible question and answer.
 */
export const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            question: 'Is OpenVue a drop-in replacement for PrimeVue?',
            answer: 'Yes. OpenVue is a fork of PrimeVue 4.5.5 that keeps the public API unchanged: usePrimeVue, PrimeVueResolver, the primevue Nuxt config key, p- prefixed CSS classes and pass-through options all work exactly as before. Migrating is a package rename, not a rewrite.'
        },
        {
            question: 'How do I migrate a PrimeVue project to OpenVue?',
            answer: 'Run @openvue/migrate from the root of your project. It detects your package manager and PrimeVue version, shows you a plan of every file and reference it will change, and only then rewrites imports and dependencies. Monorepos, Vite, Nuxt and Laravel projects are supported, and a dry run mode writes nothing.'
        },
        {
            question: 'What licence is OpenVue released under?',
            answer: 'OpenVue is MIT licensed. PrimeVue 4.5.5 was the last release published under an open source licence, and OpenVue continues that work in the open with bug fixes, accessibility and performance improvements, support for current Vue and Nuxt releases, and new components.'
        },
        {
            question: 'Can I migrate from PrimeVue v3?',
            answer: 'Not directly. The fork point is PrimeVue 4.x, and the tool stops without changing anything if it finds a different major. Apply the PrimeVue v4 migration guide first, then run @openvue/migrate.'
        }
    ].map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer }
    }))
};
