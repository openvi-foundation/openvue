# Dynamic Imports

Dynamic imports enable the loading of multiple items as needed, streamlining the import process.

## Overview

With @openvue/icons for icons and openvue for components (except Editor and Chart), multiple items can be imported together.

```vue
import { Button, InputText } from 'openvue';
import { SearchIcon, BellIcon } from '@openvue/icons';

<script setup>
import * as OpenVue from 'openvue';

const items = [
    { as: 'Button', class: 'my-button-class' },
    { as: 'InputText', class: 'my-inputtext-class' }
};
</script>

<template>
    <component v-for="item of items" :is="OpenVue[item.as]" :class="item.class" />
</template>
```

