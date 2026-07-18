<template>
    <DocSectionText v-bind="$attrs">
        <p>Configuration is managed by the <i>OpenVue</i> instance imported from <i>openvue/config</i>.</p>
    </DocSectionText>
    <DocSectionCode :code="code" hideToggleCode importCode hideStackBlitz />
</template>

<script>
export default {
    data() {
        return {
            code: {
                basic: `
import OpenVue from 'openvue/config';
const app = createApp(App);

app.use(OpenVue, { /* options */ });
`
            }
        };
    }
};
</script>
