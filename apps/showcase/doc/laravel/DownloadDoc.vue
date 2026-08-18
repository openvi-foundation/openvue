<template>
    <DocSectionText v-bind="$attrs">
        <p>OpenVue is available for download on <a href="https://www.npmjs.com/package/openvue">npm registry</a>.</p>
        <Message severity="info" :closable="false">OpenVue is currently a <b>release candidate</b>. The public API is what we intend to ship as 1.0; only bug fixes and documentation land before the stable release.</Message>
        <DocSectionCode :code="code" hideToggleCode hideStackBlitz />
        <p>
            The theming API is also published as <i>@openuxkit/themes</i>, the engine package that <i>@openvue/themes</i> is built on. Both provide the same presets and utilities, so you may substitute one for the other. See
            <NuxtLink to="/theming/styled/#packages">theme packages</NuxtLink> for details.
        </p>
        <DocSectionCode :code="codeAlt" hideToggleCode hideStackBlitz />
    </DocSectionText>
</template>

<script>
export default {
    data() {
        return {
            code: {
                basic: `
# Using npm
npm install openvue@rc @openvue/themes

# Using yarn
yarn add openvue@rc @openvue/themes

# Using pnpm
pnpm add openvue@rc @openvue/themes
`
            },
            codeAlt: {
                basic: `
# Using npm
npm install openvue@rc @openuxkit/themes

# Using yarn
yarn add openvue@rc @openuxkit/themes

# Using pnpm
pnpm add openvue@rc @openuxkit/themes
`
            }
        };
    }
};
</script>
