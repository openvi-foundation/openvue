<template>
    <DocSectionText v-bind="$attrs">
        <p>OpenIcons is available at npm, run the following command to download it to your project.</p>
    </DocSectionText>
    <DocSectionCode :code="code" hideToggleCode importCode hideStackBlitz />
</template>

<script>
export default {
    data() {
        return {
            code: {
                basic: `
npm install @openvue/openicons
`
            }
        };
    }
};
</script>
