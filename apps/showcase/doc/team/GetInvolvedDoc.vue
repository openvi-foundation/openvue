<template>
    <DocSectionText v-bind="$attrs">
        <p>
            Triage an issue, test a release against your app, or fix a doc. The <NuxtLink to="/contribution" class="doc-link">contribution guide</NuxtLink> covers setup and pull requests for this repository, and the foundation's
            <a href="https://openvi.dev/contribute" target="_blank" rel="noopener noreferrer" class="doc-link">contribute page</a> lists where help is needed most across all four projects.
        </p>
        <p>
            Conversation happens on <a href="https://discord.gg/cMVy8jAe6" target="_blank" rel="noopener noreferrer" class="doc-link">Discord</a> and in
            <a href="https://github.com/openvi-foundation/openvue/discussions" target="_blank" rel="noopener noreferrer" class="doc-link">GitHub Discussions</a>. For anything else, write to
            <a href="mailto:contact@openvi.dev" class="doc-link">contact@openvi.dev</a>.
        </p>

        <div class="alt-hero-actions">
            <Button as="a" href="https://github.com/openvi-foundation/openvue" target="_blank" rel="noopener noreferrer" label="Star on GitHub" icon="pi pi-github" />
            <Button as="a" href="https://discord.gg/cMVy8jAe6" target="_blank" rel="noopener noreferrer" label="Join Discord" icon="pi pi-discord" severity="secondary" variant="outlined" />
        </div>
    </DocSectionText>
</template>

<script>
export default {
    inheritAttrs: false
};
</script>
