<template>
    <DocSectionText v-bind="$attrs">
        <p>
            OpenVue is available for download on <a href="https://www.npmjs.com/package/openvue">npm registry</a> along with the official
            <a href="https://www.npmjs.com/package/@openvue/nuxt-module" target="_blank" rel="noopener noreferrer">@openvue/nuxt-module</a>.
        </p>
        <Message severity="info" :closable="false">OpenVue is currently in <b>beta</b>. The API is stable; we are focused on polish and feedback before the first stable release.</Message>
    </DocSectionText>
    <DocSectionCode :code="code" hideToggleCode hideStackBlitz />
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
            }
        };
    }
};
</script>
