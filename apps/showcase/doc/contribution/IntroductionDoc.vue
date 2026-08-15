<template>
    <DocSectionText v-bind="$attrs">
        <p>
            OpenVue is an open source Vue UI component library, and a community-maintained continuation of PrimeVue after it was archived by its original maintainers. It is led by
            <a href="https://github.com/openvi-foundation" target="_blank" rel="noopener noreferrer">openvi-foundation</a>, an independent group of developers who run this library in production and intend to keep it maintained, stable and open.
            OpenVue is not affiliated with PrimeTek or PrimeUI.
        </p>
        <p>
            Contributions of every size move the library forward. A bug report with a clear reproduction, a correction to a documentation page and a pull request are all worth sending. This guide covers how to set the project up locally and how the
            codebase is organized.
        </p>
        <h3>Development Setup</h3>
        <p>To begin with, clone the OpenVue repository from GitHub:</p>
        <DocSectionCode :code="code1" hideToggleCode hideStackBlitz />
        <p>
            The repository is a pnpm workspace, so install <a href="https://pnpm.io/installation" target="_blank" rel="noopener noreferrer">pnpm</a> first, then install the dependencies and run the showcase in your local environment at
            <i>http://localhost:3000/</i>.
        </p>
        <DocSectionCode :code="code2" hideToggleCode hideStackBlitz />
        <h3>Project Structure</h3>
        <p>
            OpenVue utilizes a monorepo architecture, the libraries are located at <i>packages</i> folder and the website is at <i>apps/showcase</i>. Note that the main component package lives in <i>packages/primevue</i>, a folder name kept from the
            fork, and is published as <i>openvue</i>.
        </p>
        <DocSectionCode :code="code3" hideToggleCode hideStackBlitz />
    </DocSectionText>
</template>

<script>
export default {
    data() {
        return {
            code1: {
                basic: `
git clone https://github.com/openvi-foundation/openvue.git
cd openvue
`
            },
            code2: {
                basic: `
pnpm install
pnpm run dev
`
            },
            code3: {
                basic: `
- apps
  - showcase                // website
  - volt                    // volt theme app
- packages
  - auto-import-resolver    // unplugin resolver
  - core                    // core api
  - forms                   // form validation
  - icons                   // openicons as sfc
  - mcp                     // model context protocol server
  - metadata                // list of components and directives
  - migrate                 // cli to migrate a primevue project
  - nuxt-module             // module for nuxt
  - primevue                // main package of components and directives
  - themes                  // presets of styled mode
`
            }
        };
    }
};
</script>
