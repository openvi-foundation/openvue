<template>
    <DocSectionText v-bind="$attrs">
        <p>OpenVue is available for download on <a href="https://www.npmjs.com/package/openvue">npm registry</a>.</p>
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

# Using yarn
yarn add openvue@alpha @primeuix/themes

# Using pnpm
pnpm add openvue@alpha @primeuix/themes
`
            }
        };
    }
};
</script>
