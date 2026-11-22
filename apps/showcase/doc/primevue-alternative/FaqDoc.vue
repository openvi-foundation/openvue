<template>
    <DocSectionText v-bind="$attrs" />

    <!-- Answers render with v-show, so every question and answer is in the server HTML and matches the FAQPage JSON-LD. -->
    <Accordion :value="['0']" multiple class="alt-faq" @click="onClick">
        <AccordionPanel v-for="(entry, index) in faqEntries" :key="entry.question" :value="String(index)">
            <AccordionHeader>
                <span class="alt-faq-question">{{ entry.question }}</span>
            </AccordionHeader>
            <AccordionContent>
                <p class="alt-faq-answer" v-html="entry.answer"></p>
            </AccordionContent>
        </AccordionPanel>
    </Accordion>
</template>

<script>
import { faqEntries } from './faq.js';

export default {
    inheritAttrs: false,
    data() {
        return {
            faqEntries
        };
    },
    methods: {
        // Answers are rendered with v-html, so in-app links are plain anchors; keep them client side.
        onClick(event) {
            const link = event.target.closest('a[href^="/"]');

            if (link) {
                event.preventDefault();
                this.$router.push(link.getAttribute('href'));
            }
        }
    }
};
</script>
