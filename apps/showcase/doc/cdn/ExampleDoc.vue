<template>
    <DocSectionText v-bind="$attrs">
        <p>A complete example using an OpenVue DatePicker.</p>
    </DocSectionText>
    <DocSectionCode :code="code" hideToggleCode hideStackBlitz />
</template>

<script>
export default {
    data() {
        return {
            code: {
                basic: `
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>OpenVue + CDN</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width" />
    </head>
    <body>
        <script src="https://unpkg.com/vue@3/dist/vue.global.js"><\/script>
        <script src="https://unpkg.com/openvue/umd/openvue.min.js"><\/script>
        <script src="https://unpkg.com/@openvue/themes/umd/aura.min.js"><\/script>

        <div id="app">
            <p-datepicker v-model="date"></p-datepicker>
            <br /><br />
            {{ date }}
        </div>

        <script>
            const { createApp, ref } = Vue;

            const app = createApp({
                setup() {
                const date = ref();

                return {
                    date
                };
                },
            });

            app.use(OpenVue.Config, {
                theme: {
                    preset: OpenVue.Themes.Aura
                }
            });

            app.component('p-datepicker', OpenVue.DatePicker);

            app.mount('#app');
        <\/script>
    </body>
</html>
`
            }
        };
    }
};
</script>
