[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/openvi-foundation/openvue/blob/main/LICENSE.md)
[![npm](https://img.shields.io/npm/v/openvue/rc.svg)](https://www.npmjs.com/package/openvue)

# OpenVue

OpenVue is a community-maintained continuation of PrimeVue, a rich set of open source UI components for Vue. It is not affiliated with PrimeTek or PrimeUI. See the [main repository](https://github.com/openvi-foundation/openvue) for background on the fork.

Visit [openvue.dev](https://openvue.dev) for the website, documentation, and roadmap.

## Installation

> [!NOTE]
> OpenVue is currently a **release candidate**. The public API is what we intend to ship as 1.0; only bug fixes and documentation land before the stable release. Install with the `rc` tag.

```bash
npm install openvue@rc @openvue/themes@rc
```

```js
import { createApp } from 'vue';
import OpenVue from 'openvue/config';
import Aura from '@openvue/themes/aura';
import App from './App.vue';

const app = createApp(App);

app.use(OpenVue, {
    theme: {
        preset: Aura
    }
});

app.mount('#app');
```

## License

MIT
