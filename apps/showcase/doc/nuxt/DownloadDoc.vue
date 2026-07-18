<template>
    <DocSectionText v-bind="$attrs">
        <p>
            OpenVue is available for download on <a href="https://www.npmjs.com/package/openvue">npm registry</a> along with the official
            <a href="https://www.npmjs.com/package/@openvue/nuxt-module" target="_blank" rel="noopener noreferrer">@openvue/nuxt-module</a>.
        </p>
        <Message severity="warn" :closable="false">OpenVue is currently in <b>alpha</b> and not yet production ready. APIs may change without notice before a stable release.</Message>
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
npm install openvue@alpha @primeuix/themes
npm install --save-dev @openvue/nuxt-module

# Using yarn
yarn add openvue@alpha @primeuix/themes
yarn add --dev @openvue/nuxt-module

# Using pnpm
pnpm add openvue@alpha @primeuix/themes
pnpm add -D @openvue/nuxt-module
`
            }
        };
    }
};
</script>
