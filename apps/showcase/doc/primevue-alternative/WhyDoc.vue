<template>
    <!-- Kept as static markup rather than v-for so scripts/build-llm-docs.mjs, which parses templates, sees the text. -->
    <DocSectionText v-bind="$attrs">
        <p>This is the whole migration for a typical Vite app, and <code>npx @openvue/migrate</code> writes it for you. Your components, templates, props and themes do not change.</p>

        <!-- Matches a real run of the codemod on a Vite + PrimeVue 4.5.5 app, like the homepage diff. -->
        <figure class="alt-diff">
            <pre class="alt-diff-body"><code><span class="alt-diff-line is-del"><span aria-hidden="true">-</span>  "primevue": "^4.5.5",</span>
<span class="alt-diff-line is-del"><span aria-hidden="true">-</span>  "@primeuix/themes": "^1.2.5",</span>
<span class="alt-diff-line is-add"><span aria-hidden="true">+</span>  "openvue": "{{ version }}",</span>
<span class="alt-diff-line is-add"><span aria-hidden="true">+</span>  "@openvue/themes": "{{ version }}",</span>
<span class="alt-diff-line"> </span>
<span class="alt-diff-line is-del"><span aria-hidden="true">-</span>import PrimeVue from 'primevue/config';</span>
<span class="alt-diff-line is-del"><span aria-hidden="true">-</span>import Aura from '@primeuix/themes/aura';</span>
<span class="alt-diff-line is-add"><span aria-hidden="true">+</span>import PrimeVue from 'openvue/config';</span>
<span class="alt-diff-line is-add"><span aria-hidden="true">+</span>import Aura from '@openvue/themes/aura';</span></code></pre>
        </figure>

        <div class="alt-reasons">
            <div class="alt-reason">
                <h3 class="alt-reason-title">Nothing to rewrite</h3>
                <p>Same components, props, events, slots, pass-through and themes as PrimeVue 4.5.5. Switching is a package rename that one command does for you.</p>
            </div>
            <div class="alt-reason">
                <h3 class="alt-reason-title">MIT, no license fees</h3>
                <p>No per-developer pricing, no revenue limits, no license keys. Every package is MIT, and a license change elsewhere cannot reach code you already have.</p>
            </div>
            <div class="alt-reason">
                <h3 class="alt-reason-title">Still moving forward</h3>
                <p>Ten releases since July 2026, a stable 1.0 in September, and fixes and features landing every few weeks from a growing group of contributors.</p>
            </div>
        </div>
    </DocSectionText>
</template>

<script>
import pkg from '../../../../packages/primevue/package.json';

export default {
    inheritAttrs: false,
    data() {
        return {
            version: pkg.version
        };
    }
};
</script>
