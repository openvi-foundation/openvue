<template>
    <DocSectionText v-bind="$attrs">
        <p>Unstyled mode is enabled for the whole suite by enabling <i>unstyled</i> option during OpenVue installation.</p>
        <DocSectionCode :code="code1" hideToggleCode importCode hideStackBlitz />
        <p>Alternatively even in the default styled mode, a particular component can still be used as unstyled by adding the <i>unstyled</i> prop of the component.</p>
        <div class="card flex justify-center">
            <Button label="Check" icon="pi pi-check" unstyled />
        </div>
        <DocSectionCode :code="code2" hideToggleCode hideStackBlitz />
    </DocSectionText>
</template>

<script>
export default {
    data() {
        return {
            code1: {
                basic: `
import { createApp } from "vue";
import OpenVue from "openvue/config";
const app = createApp(App);

app.use(OpenVue, { unstyled: true });
`
            },
            code2: {
                basic: `
<Button label="Check" icon="pi pi-check" unstyled></Button>
`
            }
        };
    }
};
</script>
