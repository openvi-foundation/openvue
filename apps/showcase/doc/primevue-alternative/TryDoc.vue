<template>
    <DocSectionText v-bind="$attrs">
        <p>You don't have to commit to anything to find out whether OpenVue works for your app.</p>

        <ol class="alt-steps">
            <li class="alt-step">
                <h3>Test it with zero code changes</h3>
                <p>Add a package override so your existing <code>primevue</code> imports resolve to OpenVue, run your app and your tests. Delete the override to go back.</p>
                <DocSectionCode :code="code" hideToggleCode hideStackBlitz />
            </li>
            <li class="alt-step">
                <h3>Preview the migration</h3>
                <p><code>npx @openvue/migrate --dry</code> lists every file and dependency it would change, and writes nothing.</p>
            </li>
            <li class="alt-step">
                <h3>Migrate for real</h3>
                <p><code>npx @openvue/migrate</code> asks before writing, and the result is one git diff you can review and revert like any other change.</p>
            </li>
        </ol>

        <p class="alt-after">
            For pnpm and yarn overrides, monorepos and every option, see the <NuxtLink to="/migrate" class="doc-link">migration guide</NuxtLink>. Starting a new project instead? Follow the
            <NuxtLink to="/setup" class="doc-link">setup guide</NuxtLink>.
        </p>
    </DocSectionText>
</template>

<script>
import pkg from '../../../../packages/primevue/package.json';

export default {
    inheritAttrs: false,
    data() {
        return {
            code: {
                basic: `
// package.json, npm and bun
{
    "overrides": {
        "primevue": "npm:openvue@${pkg.version}"
    }
}
`
            }
        };
    }
};
</script>
