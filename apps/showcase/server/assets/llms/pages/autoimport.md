# Auto Import

On-demand OpenVue components with auto imports and tree-shaking.

## Example

A complete example using OpenVue with auto imports is available at the playground .

## Overview

OpenVue components need to be imported and configured individually. In the next section, we'll cleanup the code using auto imports.

```vue
import { createApp } from "vue";
import OpenVue from "openvue/config";
import InputText from 'openvue/inputtext';
import Button from 'openvue/button';
import App from './App.vue'
const app = createApp(App);

app.use(OpenVue);
app.component('InputText', InputText);
app.component('Button', Button);
```

## Unplugin

The unplugin-vue-components library can automatically import and register OpenVue components with the help of @openvue/auto-import-resolver . Begin with installing the packages as dev dependencies. Next step would be adding the PrimeVueResolver at vite.config using the Components plugin. That's it, now the initialization code can be refactored as the following. For configuration like namespacing, visit the official documentation .

