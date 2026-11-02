<template>
    <section :class="['theme-builder-section', { 'theme-builder-section-open': open }]" :aria-labelledby="headingId">
        <div class="theme-builder-section-head">
            <button :id="headingId" type="button" class="theme-builder-section-toggle" :aria-expanded="open" :aria-controls="bodyId" @click="open = !open">
                <i class="pi pi-chevron-right theme-builder-section-caret" aria-hidden="true"></i>
                <span class="theme-builder-section-title">{{ title }}</span>
                <span v-if="summary" class="theme-builder-section-summary">{{ summary }}</span>
            </button>
            <button v-if="modified" type="button" class="theme-builder-section-reset" :aria-label="'Reset ' + title.toLowerCase()" title="Back to the default" @click="$emit('reset')">Reset</button>
        </div>
        <div v-show="open" :id="bodyId" class="theme-builder-section-body">
            <slot></slot>
        </div>
    </section>
</template>

<script>
export default {
    emits: ['reset'],
    props: {
        title: {
            type: String,
            required: true
        },
        summary: {
            type: String,
            default: ''
        },
        modified: Boolean
    },
    data() {
        const id = 'tb-section-' + this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        return {
            open: true,
            headingId: id,
            bodyId: id + '-body'
        };
    }
};
</script>
