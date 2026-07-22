<div align="center">

# OpenVue

**The Vue UI component library, continued.**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)
[![npm](https://img.shields.io/npm/v/openvue/alpha.svg)](https://www.npmjs.com/package/openvue)
[![npm downloads](https://img.shields.io/npm/dt/openvue.svg)](https://www.npmjs.com/package/openvue)

</div>

## About

OpenVue is a community-maintained continuation of PrimeVue, one of the most widely adopted Vue.js component libraries, following its archival by the original maintainers. The project is stewarded by [openvi-foundation](https://github.com/openvi-foundation), an independent organization of experienced developers who use this library in production and are committed to keeping it maintained, stable, and open.

OpenVue is not affiliated with PrimeTek or PrimeUI. We started this project because a library with this much adoption, and this many teams depending on it, deserves a maintenance path that isn't tied to any single company's plans.

## Installation

> [!NOTE]
> OpenVue is currently in **alpha**. APIs may change before a stable release. Install with the `alpha` tag.

```bash
npm install openvue@alpha @openvue/themes@alpha
```

Register a theme preset when installing the plugin:

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

Additional packages (`@openvue/forms`, `@openvue/nuxt-module`, `@openvue/mcp`, ...) are opt-in — install them only if you need form validation, Nuxt integration, or the MCP server.

## Ecosystem

The fork spans the full toolchain, each piece maintained under the [openvi-foundation](https://github.com/orgs/openvi-foundation/repositories) organization.

| Repository                                                                | Description                                         |
| ------------------------------------------------------------------------- | --------------------------------------------------- |
| [openvue](https://github.com/openvi-foundation/openvue)                   | The core Vue UI component library (this repository) |
| [openux](https://github.com/openvi-foundation/openux)                     | Shared theming and design-token package             |
| [openicons](https://github.com/openvi-foundation/openicons)               | Icon library                                        |
| [openvue-tailwind](https://github.com/openvi-foundation/openvue-tailwind) | Components styled with Tailwind CSS                 |

## Roadmap

Our priority is stability first, growth second. In order:

1. ~~**Publish to npm.**~~ Done — OpenVue packages are live under the [`@openvue`](https://www.npmjs.com/org/openvue) org, currently tagged `alpha`.
2. **Stabilize and release.** Work through the existing issue backlog, keep dependencies current, and graduate from alpha to a predictable, versioned release process.
3. **Launch the OpenVue website.** Documentation and a live playground for testing components, in the spirit of the original primevue.org.
4. **Grow the community.** Open governance, responsive maintainers, and a clear path for contributors.
5. **Expand the library.** Once the foundation is stable, invest in new components and improvements.

## Contributing

We're building the initial maintainer team now. If you're an experienced developer interested in helping maintain or grow this library, issues and pull requests are open, and we'd welcome the help.

## License

MIT, unchanged. Every release under the MIT license stays exactly as it is. This fork doesn't affect that in any way.
