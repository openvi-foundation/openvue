<template>
    <DocSectionText v-bind="$attrs">
        <div class="leading-relaxed" @click="onClick">
            <template v-for="(entry, index) in faqEntries" :key="entry.question">
                <h3 v-text="entry.question" class="font-semibold" :class="index ? 'mt-6' : null"></h3>
                <p v-html="entry.answer"></p>
            </template>
        </div>
    </DocSectionText>
</template>

<script>
import { faqEntries } from './faq.js';

export default {
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
