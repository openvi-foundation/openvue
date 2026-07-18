<template>
    <DocSectionText v-bind="$attrs">
        <p>OpenVue components need to be imported and configured individually. In the next section, we'll cleanup the code using auto imports.</p>
    </DocSectionText>
    <DocSectionCode :code="code" hideToggleCode importCode hideStackBlitz />
</template>

<script>
export default {
    data() {
        return {
            code: {
                basic: `
import { createApp } from "vue";
import OpenVue from "openvue/config";
import InputText from 'openvue/inputtext';
import Button from 'openvue/button';
import App from './App.vue'
const app = createApp(App);

app.use(OpenVue);
app.component('InputText', InputText);
app.component('Button', Button);
`
            }
        };
    }
};
</script>
