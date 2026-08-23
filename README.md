<div align="center">

# OpenVue

**The Vue UI component library, continued.**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)
[![npm](https://img.shields.io/npm/v/openvue/rc.svg)](https://www.npmjs.com/package/openvue)
[![npm downloads](https://img.shields.io/npm/dt/openvue.svg)](https://www.npmjs.com/package/openvue)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-8-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

[**Documentation**](https://openvue.dev) · [**Setup**](https://openvue.dev/setup) · [**Playground**](https://openvue.dev/playground) · [**Migrate from PrimeVue**](https://openvue.dev/migrate) · [**Changelog**](CHANGELOG.md)

</div>

## About

OpenVue is a community-maintained continuation of PrimeVue, one of the most widely adopted Vue.js component libraries, following its archival by the original maintainers. The project is stewarded by [openvi-foundation](https://github.com/openvi-foundation), an independent organization of experienced developers who use this library in production and are committed to keeping it maintained, stable, and open.

OpenVue is not affiliated with PrimeTek or PrimeUI. We started this project because a library with this much adoption, and this many teams depending on it, deserves a maintenance path that isn't tied to any single company's plans.

## Migrating from PrimeVue

**The migration tool is ready, try it out!** One command moves an existing PrimeVue v4 project to OpenVue:

```sh
npx @openvue/migrate
```

It shows you a plan first (detected package manager, PrimeVue version, and every file it will change) and asks before writing anything. It renames dependencies, rewrites imports, and audits what's left, leaving a single reviewable diff. Use `--dry` for a preview that writes nothing.

Read the full guide at [openvue.dev/migrate](https://openvue.dev/migrate) or the [`@openvue/migrate` README](packages/migrate/README.md).

## Installation

> [!NOTE]
> OpenVue is currently a **release candidate**. The public API is what we intend to ship as 1.0; only bug fixes and documentation land before the stable release. Install with the `rc` tag.

```bash
npm install openvue@rc @openvue/themes@rc
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

Additional packages (`@openvue/forms`, `@openvue/nuxt-module`, `@openvue/mcp`, ...) are opt-in. Install them only if you need form validation, Nuxt integration, or the MCP server.

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

1. ~~**Publish to npm.**~~ Done: OpenVue packages are live under the [`@openvue`](https://www.npmjs.com/org/openvue) org, currently tagged `rc`.
2. ~~**Launch the OpenVue website.**~~ Done: [openvue.dev](https://openvue.dev) is live with the full documentation and interactive component demos.
3. ~~**Ship a PrimeVue migration tool.**~~ Done: [`npx @openvue/migrate`](https://openvue.dev/migrate) moves a PrimeVue v4 project to OpenVue in one command.
4. **Stabilize and release.** Now at **1.0.0-rc**. The API is frozen for 1.0; we are working through the remaining backlog and taking feedback before the stable release.
5. **Grow the community.** Open governance, responsive maintainers, and a clear path for contributors.
6. **Expand the library.** Once the foundation is stable, invest in new components and improvements.

## Contributing

We're building the initial maintainer team now. If you're an experienced developer interested in helping maintain or grow this library, issues and pull requests are open, and we'd welcome the help.

Start with the [contributing guide](CONTRIBUTING.md) for the development setup and how changes get reviewed. Participation is covered by our [code of conduct](CODE_OF_CONDUCT.md). To report a security issue, follow the [security policy](SECURITY.md) rather than opening an issue.

## Contributors ✨

Everyone who has helped build OpenVue since the fork: code, docs, design, bug reports, and ideas.

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="12.5%"><a href="https://github.com/NJevric"><img src="https://avatars.githubusercontent.com/u/46942531?v=4?s=64" width="64px;" alt="Nikola Jevrić"/><br /><sub><b>Nikola Jevrić</b></sub></a><br /><a href="https://github.com/openvi-foundation/openvue/commits?author=NJevric" title="Code">💻</a> <a href="https://github.com/openvi-foundation/openvue/commits?author=NJevric" title="Documentation">📖</a> <a href="#maintenance-NJevric" title="Maintenance">🚧</a> <a href="#infra-NJevric" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/openvi-foundation/openvue/pulls?q=is%3Apr+reviewed-by%3ANJevric" title="Reviewed Pull Requests">👀</a> <a href="#ideas-NJevric" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="12.5%"><a href="https://github.com/dekitriv"><img src="https://avatars.githubusercontent.com/u/52245546?v=4?s=64" width="64px;" alt="dekitriv"/><br /><sub><b>dekitriv</b></sub></a><br /><a href="https://github.com/openvi-foundation/openvue/commits?author=dekitriv" title="Code">💻</a> <a href="#infra-dekitriv" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
      <td align="center" valign="top" width="12.5%"><a href="https://github.com/sane6"><img src="https://avatars.githubusercontent.com/u/57320614?v=4?s=64" width="64px;" alt="Srđan Sanadrović"/><br /><sub><b>Srđan Sanadrović</b></sub></a><br /><a href="https://github.com/openvi-foundation/openvue/commits?author=sane6" title="Code">💻</a> <a href="https://github.com/openvi-foundation/openvue/issues?q=author%3Asane6" title="Bug reports">🐛</a> <a href="https://github.com/openvi-foundation/openvue/commits?author=sane6" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="12.5%"><a href="https://github.com/miske11"><img src="https://avatars.githubusercontent.com/u/88431819?v=4?s=64" width="64px;" alt="miske11"/><br /><sub><b>miske11</b></sub></a><br /><a href="https://github.com/openvi-foundation/openvue/commits?author=miske11" title="Code">💻</a> <a href="#design-miske11" title="Design">🎨</a></td>
      <td align="center" valign="top" width="12.5%"><a href="https://github.com/Tamas-hi"><img src="https://avatars.githubusercontent.com/u/36476318?v=4?s=64" width="64px;" alt="Tamás H."/><br /><sub><b>Tamás H.</b></sub></a><br /><a href="https://github.com/openvi-foundation/openvue/commits?author=Tamas-hi" title="Code">💻</a></td>
      <td align="center" valign="top" width="12.5%"><a href="https://github.com/NikoGJ"><img src="https://avatars.githubusercontent.com/u/18424051?v=4?s=64" width="64px;" alt="Nicolas Granjon"/><br /><sub><b>Nicolas Granjon</b></sub></a><br /><a href="https://github.com/openvi-foundation/openvue/issues?q=author%3ANikoGJ" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="12.5%"><a href="https://github.com/Mettbrot"><img src="https://avatars.githubusercontent.com/u/1036625?v=4?s=64" width="64px;" alt="Mettbrot"/><br /><sub><b>Mettbrot</b></sub></a><br /><a href="https://github.com/openvi-foundation/openvue/issues?q=author%3AMettbrot" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="12.5%"><a href="https://github.com/michaelw85"><img src="https://avatars.githubusercontent.com/u/3629094?v=4?s=64" width="64px;" alt="Michael Withagen"/><br /><sub><b>Michael Withagen</b></sub></a><br /><a href="#ideas-michaelw85" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

MIT, unchanged. Every release under the MIT license stays exactly as it is. This fork doesn't affect that in any way.
