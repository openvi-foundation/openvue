<template>
    <DocSectionText v-bind="$attrs">
        <p>
            If you just want to evaluate OpenVue first, add only the compatibility override yourself instead of running the codemod; no source changes needed. Use <i>overrides</i> for npm and bun, <i>pnpm.overrides</i> for pnpm, or
            <i>resolutions</i> for yarn.
        </p>
        <p>Once you decide to stay, run <i>npx @openvue/migrate</i> for the real rename.</p>
    </DocSectionText>
    <DocSectionCode :code="code" hideToggleCode hideStackBlitz />
</template>

<script>
export default {
    data() {
        return {
            code: {
                basic: `
{
    "overrides": {
        "primevue": "npm:openvue@0.0.1-beta.0"
    }
}
`
            }
        };
    }
};
</script>
