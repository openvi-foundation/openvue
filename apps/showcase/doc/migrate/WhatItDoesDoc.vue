<template>
    <DocSectionText v-bind="$attrs">
        <ol class="leading-relaxed">
            <li>
                <b>Renames dependencies</b> in every <i>package.json</i>, monorepos included: <i>dependencies</i>, <i>devDependencies</i>, <i>peerDependencies</i>, <i>optionalDependencies</i>, <i>resolutions</i>, <i>overrides</i> and
                <i>pnpm.overrides</i>, including selector keys like <i>**&#47;primevue</i> or <i>primevue@^4</i>. <i>workspace:</i>, <i>catalog:</i> and <i>npm:</i> protocol values are preserved, and <i>pnpm-workspace.yaml</i> catalogs are rewritten
                too.
            </li>
            <li>
                <b>Rewrites module specifiers</b> in <i>.js</i>, <i>.ts</i>, <i>.vue</i>, <i>.jsx</i>, <i>.tsx</i>, <i>.astro</i>, <i>.mdx</i> and related files: static imports, <i>import type</i>, <i>require()</i>, dynamic <i>import()</i>, Nuxt
                <i>modules</i> arrays, Vite <i>optimizeDeps</i> and <i>transpile</i> entries, and generated <i>components.d.ts</i> files. A bare <i>primevue</i> string is only rewritten in import positions, so runtime data like
                <i>provider: 'primevue'</i> is never touched.
            </li>
            <li><b>Adds a compatibility override</b>, <i>"primevue": "npm:openvue@&lt;version&gt;"</i>, so third-party libraries that depend or peer-depend on <i>primevue</i> resolve to OpenVue. Remove it once your whole dependency graph is OpenVue-native, or skip it with <i>--no-alias</i>.</li>
            <li><b>Audits what's left</b>: after rewriting, it scans sources, styles, HTML and tsconfig files for surviving PrimeVue references and lists each one with file and line, so it never reports success while actionable references remain.</li>
        </ol>
        <p>The rename mapping:</p>
        <div class="doc-tablewrapper">
            <table class="doc-table">
                <thead>
                    <tr>
                        <th>From</th>
                        <th>To</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><i>primevue</i>, <i>primevue/*</i></td>
                        <td><i>openvue</i>, <i>openvue/*</i></td>
                    </tr>
                    <tr>
                        <td><i>@primevue/core</i>, <i>@primevue/forms</i>, <i>@primevue/icons</i>, <i>@primevue/themes</i>, <i>@primevue/nuxt-module</i>, <i>@primevue/auto-import-resolver</i>, <i>@primevue/metadata</i>, <i>@primevue/mcp</i></td>
                        <td>same names under <i>@openvue/*</i></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </DocSectionText>
</template>
