# Install OpenVue with CDN

Setting up OpenVue in a project using CDN.

## CreateApp

Create an app container element and setup the application using createApp .

```vue
<body>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"><\/script>

    <div id="app">
    </div>

    <script>
        const { createApp, ref } = Vue;

        const app = createApp({
            setup() {

            }
        });

        app.mount('#app');
    <\/script>
</body>
```

## Example

A complete example using an OpenVue DatePicker.

```vue
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
```

## Plugin

OpenVue plugin is required to be installed as an application plugin to set up the default configuration .

```vue
app.use(OpenVue.Config);
```

## Script

You can use OpenVue and Vue.js from a CDN with a script tag. This approach does not involve any build step, and is suitable for enhancing static HTML. This guide uses unpkg however other providers such as jsdeliver and cdnjs can also be used.

```vue
https://unpkg.com/vue@3/dist/vue.global.js
https://unpkg.com/openvue/umd/openvue.min.js
https://unpkg.com/@openvue/themes/umd/aura.min.js
```

## Theming

Include the theme preset via a script element, valid options are Aura, Lara, Nora and Material. The theme script must be placed after the OpenVue script, otherwise the preset is not registered on the OpenVue global.

```vue
<!-- <script src="https://unpkg.com/@openvue/themes/umd/{preset}.min.js"><\/script> -->

<script src="https://unpkg.com/@openvue/themes/umd/aura.min.js"><\/script>
<script src="https://unpkg.com/@openvue/themes/umd/lara.min.js"><\/script>
<script src="https://unpkg.com/@openvue/themes/umd/nora.min.js"><\/script>
<script src="https://unpkg.com/@openvue/themes/umd/material.min.js"><\/script>
```

