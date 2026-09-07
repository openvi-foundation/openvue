<template>
    <DocSectionText v-bind="$attrs">
        <p>
            If you just want to evaluate OpenVue first, add an override yourself instead of running the codemod; no source changes needed. Use <i>overrides</i> for npm and bun, or <i>resolutions</i> for yarn.
        </p>
        <p>On pnpm, put the same <i>overrides</i> entry in <i>pnpm-workspace.yaml</i> instead, because pnpm 11 no longer reads the <i>pnpm</i> field from <i>package.json</i>.</p>
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
        "primevue": "npm:openvue@1.0.0-rc.0"
    }
}
`
            }
        };
    }
};
</script>
