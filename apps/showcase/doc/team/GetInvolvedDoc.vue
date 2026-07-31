<template>
    <DocSectionText v-bind="$attrs">
        <p>We are early, and we are in this for the long run. If you want to help, star the repo, join the discussion, or tell someone who still ships with PrimeVue.</p>

        <div class="flex flex-wrap gap-3 mt-6">
            <a href="https://github.com/openvi-foundation/openvue" target="_blank" rel="noopener noreferrer" class="no-underline">
                <Button label="Star on GitHub" icon="pi pi-github" />
            </a>
            <a href="https://github.com/openvi-foundation/openvue/discussions" target="_blank" rel="noopener noreferrer" class="no-underline">
                <Button label="Join the Discussion" icon="pi pi-comments" severity="secondary" outlined />
            </a>
            <a href="https://www.openvi.dev" target="_blank" rel="noopener noreferrer" class="no-underline">
                <Button label="Visit openvi.dev" icon="pi pi-external-link" severity="secondary" outlined />
            </a>
        </div>
    </DocSectionText>
</template>
