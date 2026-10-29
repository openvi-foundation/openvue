<template>
    <span class="theme-builder-font-option">
        <span class="theme-builder-font-option-text" :style="{ fontFamily: stack }">
            <span class="theme-builder-font-option-name">{{ entry.family }}</span>
            <span class="theme-builder-font-option-sample">{{ sample }}</span>
        </span>
        <i v-if="selected" class="pi pi-check" aria-hidden="true"></i>
    </span>
</template>

<script>
import { fontStack } from '@/service/theme/compile';
import { SAMPLE_TEXT, previewFontUrl } from '@/service/theme/fonts';

const SETTLE_MS = 120;

export default {
    props: {
        entry: {
            type: Object,
            required: true
        },
        selected: Boolean
    },
    data() {
        return {
            sample: SAMPLE_TEXT
        };
    },
    mounted() {
        this.schedule();
    },
    beforeUnmount() {
        clearTimeout(this.timer);
    },
    watch: {
        entry() {
            this.schedule();
        }
    },
    methods: {
        isLoaded() {
            return !!document.head.querySelector('link[data-font-preview="' + this.entry.family + '"]');
        },
        schedule() {
            clearTimeout(this.timer);

            if (this.isLoaded()) return;

            this.timer = setTimeout(this.load, SETTLE_MS);
        },
        load() {
            if (this.isLoaded()) return;

            const link = document.createElement('link');

            link.rel = 'stylesheet';
            link.href = previewFontUrl(this.entry);
            link.setAttribute('data-font-preview', this.entry.family);
            link.setAttribute('data-theme-builder', '');
            document.head.appendChild(link);
        }
    },
    computed: {
        stack() {
            return fontStack(this.entry.family);
        }
    }
};
</script>
