<template>
    <DocSectionText v-bind="$attrs">
        <p>You don't have to commit to anything to find out whether OpenVue works for your app.</p>
        <ol class="leading-relaxed">
            <li><b>Test it with zero code changes.</b> Add a package override so your existing <i>primevue</i> imports resolve to OpenVue, run your app and your tests. Delete the override to go back.</li>
            <li><b>Preview the migration.</b> <i>npx @openvue/migrate --dry</i> lists every file and dependency it would change, and writes nothing.</li>
            <li><b>Migrate for real.</b> <i>npx @openvue/migrate</i> asks before writing, and the result is one git diff you can review and revert like any other change.</li>
        </ol>
    </DocSectionText>
    <DocSectionCode :code="code" hideToggleCode hideStackBlitz />
    <div class="doc-section-description">
        <p class="mb-0">
            For pnpm and yarn overrides, monorepos and every option, see the <NuxtLink to="/migrate" class="doc-link">migration guide</NuxtLink>. Starting a new project instead? Follow the
            <NuxtLink to="/setup" class="doc-link">setup guide</NuxtLink>.
        </p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            code: {
                basic: `
// 1. try OpenVue without touching your code (package.json, npm and bun)
{
    "overrides": {
        "primevue": "npm:openvue@1.0.0"
    }
}

// 2. preview what the migration changes
npx @openvue/migrate --dry

// 3. migrate
npx @openvue/migrate
`
            }
        };
    }
};
</script>
