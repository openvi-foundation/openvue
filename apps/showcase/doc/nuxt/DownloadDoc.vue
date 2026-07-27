<template>
    <DocSectionText v-bind="$attrs">
        <p>
            OpenVue is available for download on <a href="https://www.npmjs.com/package/openvue">npm registry</a> along with the official
            <a href="https://www.npmjs.com/package/@openvue/nuxt-module" target="_blank" rel="noopener noreferrer">@openvue/nuxt-module</a>.
        </p>
        <Message severity="info" :closable="false">OpenVue is currently in <b>beta</b>. The API is stable; we are focused on polish and feedback before the first stable release.</Message>
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
npm install openvue@beta @openvue/themes
npm install --save-dev @openvue/nuxt-module@beta

# Using yarn
yarn add openvue@beta @openvue/themes
yarn add --dev @openvue/nuxt-module@beta

# Using pnpm
pnpm add openvue@beta @openvue/themes
pnpm add -D @openvue/nuxt-module@beta
`
            },
            codeAlt: {
                basic: `
# Using npm
npm install openvue@beta @openuxkit/themes
npm install --save-dev @openvue/nuxt-module@beta

# Using yarn
yarn add openvue@beta @openuxkit/themes
yarn add --dev @openvue/nuxt-module@beta

# Using pnpm
pnpm add openvue@beta @openuxkit/themes
pnpm add -D @openvue/nuxt-module@beta
`
            }
        };
    }
};
</script>
