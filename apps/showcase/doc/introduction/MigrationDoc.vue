<template>
    <DocSectionText v-bind="$attrs">
        <p>An existing PrimeVue v4 project moves over with a single command, no manual find and replace required.</p>
        <DocSectionCode :code="code" hideToggleCode hideStackBlitz />
        <p class="mb-0">
            The tool shows you a plan first, covering the detected package manager, the PrimeVue version and every file it intends to touch, then asks before writing anything. It renames dependencies, rewrites imports and leaves a single reviewable
            diff. Run it with <i>--dry</i> for a preview that writes nothing, and see the <NuxtLink to="/migrate">migration guide</NuxtLink> for the full walkthrough.
        </p>
    </DocSectionText>
</template>

<script>
export default {
    data() {
        return {
            code: {
                basic: `
npx @openvue/migrate
`
            }
        };
    }
};
</script>
