<template>
    <DocSectionText v-bind="$attrs">
        <p>OpenVue is available for download on <a href="https://www.npmjs.com/package/openvue">npm registry</a>.</p>
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
npm install openvue@beta @primeuix/themes

# Using yarn
yarn add openvue@beta @primeuix/themes

# Using pnpm
pnpm add openvue@beta @primeuix/themes
`
            }
        };
    }
};
</script>
