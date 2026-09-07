# Install OpenVue with Vite

Setting up OpenVue in a Vite project.

## Download

OpenVue is available for download on npm registry . OpenVue is currently a release candidate . The public API is what we intend to ship as 1.0; only bug fixes and documentation land before the stable release. The theming API is also published as @openuxkit/themes , the engine package that @openvue/themes is built on. Both provide the same presets and utilities, so you may substitute one for the other. See theme packages for details.

```vue
# Using npm
npm install openvue@rc @openvue/themes

# Using yarn
yarn add openvue@rc @openvue/themes

# Using pnpm
pnpm add openvue@rc @openvue/themes
```

## Examples

We've created various samples for the popular options in the Vue ecosystem. Visit the openvue-examples repository for more samples including vite-quickstart and vite-ts-quickstart .

## Next Steps

Welcome to the Prime UI Ecosystem! Once you have OpenVue up and running, we recommend exploring the following resources to gain a deeper understanding of the library. Global configuration Auto imports with tree-shaking Customization of styles Pass through attributes

## Plugin

OpenVue plugin is required to be installed as an application plugin to set up the default configuration . The plugin is lightweight, and only utilized for configuration purposes.

```vue
import { createApp } from 'vue';
import OpenVue from 'openvue/config';

const app = createApp(App);
app.use(OpenVue);
```

## Plugin

Configure OpenVue to use a theme like Aura.

```vue
import { createApp } from 'vue';
import OpenVue from 'openvue/config';
import Aura from '@openvue/themes/aura';

const app = createApp(App);
app.use(OpenVue, {
    theme: {
        preset: Aura
    }
});
```

## Verify

Verify your setup by adding a component such as Button . Each component can be imported and registered individually so that you only include what you use for bundle optimization. Import path is available in the documentation of the corresponding component.

```vue
import Button from "openvue/button"

const app = createApp(App);
app.component('Button', Button);
```

<details>
<summary>Composition API Example</summary>

```vue
<template>
    <div class="card flex justify-center">
        <Button label="Verify" />
    </div>
</template>

<script setup>
<\/script>
```
</details>

