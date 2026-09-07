import entries from './faq.json';

/**
 * Single source for the /migrate FAQ.
 *
 * faq.json holds the questions and answers; FaqDoc.vue renders them and the FAQPage
 * structured data below is derived from them, so the markup always has a matching visible
 * question and answer. Answers carry inline HTML, stripped back to prose for the JSON-LD.
 * scripts/build-llm-docs.mjs reads faq.json directly, since it parses doc sources rather
 * than the rendered page.
 */
export const faqEntries = entries;

const toPlainText = (html) =>
    html
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();

export const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqEntries.map((entry) => ({
        '@type': 'Question',
        name: entry.question,
        acceptedAnswer: { '@type': 'Answer', text: toPlainText(entry.answer) }
    }))
};
