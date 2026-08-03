# Icons

OpenIcons is the default icon library of OpenVue, a community-maintained continuation of PrimeIcons with 323 icons. It is optional as OpenVue components can use any icon with templating.

## Migration from PrimeIcons

The class prefix changed from pi to oi in this release. Existing markup keeps working through a compatibility stylesheet that aliases every .pi-* class onto the OpenIcons font, so migrating from the primeicons package is a one line dependency swap and nothing in your templates has to change. That entry point loads openicons-compat.css , which is also importable directly. To move to the new prefix, import @openvue/openicons/openicons.css instead and rename pi pi-check to oi oi-check throughout. Both stylesheets can be loaded at once during a gradual migration. One icon was removed rather than renamed: pi-prime was the PrimeTek logo mark, which the MIT license does not cover. OpenIcons is stewarded by the OpenVi Foundation and is not affiliated with PrimeTek or PrimeUI.

## Vue Components

The webfont loads all 323 glyphs to show one, cannot be multicolored, and places icons in the text layer where screen readers meet them. For Vue 3 applications, @openvue/openicons-vue ships each icon as a tree-shakeable SVG component instead, so importing two icons costs under 1KB. Components default to 1em and currentColor , so they follow the surrounding text exactly as the font does. They are aria-hidden unless given a title , which promotes them to role="img" with an accessible name.

```vue
<script setup>
import OiCheck from '@openvue/openicons-vue/icons/OiCheck';
<\/script>

<template>
    <OiCheck />
    <OiCheck :size="32" title="Saved" />
<\/template>
```

## Constants

Constants API is available to reference icons easily when used programmatically. The exported values still resolve to the legacy pi-&#123;icon&#125; class names, which the compatibility stylesheet maps onto the OpenIcons font.

```vue
<template>
    <div class="card flex justify-center">
        <Menu :model="items" />
    </div>
</template>

<script>
import { PrimeIcons } from '@openvue/core/api';

export default {
    data() {
        return {
            items: [
                {
                    label: 'File',
                    items: [
                        { label: 'New', icon: PrimeIcons.PLUS },
                        { label: 'Open', icon: PrimeIcons.DOWNLOAD }
                    ]
                }
            ]
        };
    }
};
<\/script>
```

## Download

OpenIcons is available at npm, run the following command to download it to your project. OpenIcons is currently in beta, so install it with the beta tag.

```vue
npm install @openvue/openicons@beta
```

## Import

CSS file of the icon library needs to be imported at the entry point of your application. This stylesheet defines the oi prefix only. If your application still uses pi class names, from markup written against PrimeIcons or from the constants API , import the compatibility stylesheet instead.

## List

Here is the full list of OpenIcons. More icons will be added periodically and you may also request new icons at the issue tracker.

## Webfont

Once the stylesheet is imported, reference an icon by class on an element such as i or span . Icons inherit font-size and color from their parent, so they scale with the surrounding text. The oi-fw class gives an icon a fixed width, which is useful for aligning lists of menu items.

```vue
<i class="oi oi-check"></i>
<i class="oi oi-spin oi-spinner"></i>
<i class="oi oi-search" style="font-size: 1.5rem; color: var(--p-primary-color)"></i>
```

