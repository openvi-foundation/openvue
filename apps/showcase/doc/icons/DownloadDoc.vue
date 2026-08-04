<template>
    <DocSectionText v-bind="$attrs">
        <p>OpenIcons is available at npm, run the following command to download it to your project. OpenIcons is currently in beta, so install it with the <i>beta</i> tag.</p>
    </DocSectionText>
    <DocSectionCode :code="code" hideToggleCode importCode hideStackBlitz />
</template>

<script>
export default {
    data() {
        return {
            code: {
                basic: `
npm install @openvue/openicons@beta
`
            }
        };
    }
};
</script>
