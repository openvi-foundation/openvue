<template>
    <DocSectionText v-bind="$attrs">
        <p>Configure OpenVue to use a theme like Aura.</p>
        <DocSectionCode :code="code" importCode hideToggleCode hideStackBlitz />
    </DocSectionText>
</template>

<script>
export default {
    data() {
        return {
            code: {
                basic: `
import { createApp } from 'vue';
import OpenVue from 'openvue/config';
import Aura from '@primeuix/themes/aura';

const app = createApp(App);
app.use(OpenVue, {
    theme: {
        preset: Aura
    }
});
`
            }
        };
    }
};
</script>
