<template>
    <!-- Kept as static markup rather than v-for so scripts/build-llm-docs.mjs, which parses templates, sees the text. -->
    <DocSectionText v-bind="$attrs">
        <p>A fork is only worth switching to if it keeps shipping. Here are a few highlights from the <NuxtLink to="/changelog" class="doc-link">changelog</NuxtLink>.</p>

        <ul class="alt-shipped">
            <li>
                <div>
                    <h3>Theme Designer, free</h3>
                    <p>Edit every design token visually, watch the docs restyle as you type, and export a preset. No account, no license key, runs entirely in your browser.</p>
                </div>
                <a href="https://github.com/openvi-foundation/openvue/pull/655" target="_blank" rel="noopener noreferrer" class="alt-shipped-ref doc-link">PR #655</a>
            </li>
            <li>
                <div>
                    <h3>TreeTable filtering</h3>
                    <p>The filter row and multi-rule filter menu that DataTable already had, styled in all four presets.</p>
                </div>
                <a href="https://github.com/openvi-foundation/openvue/issues/638" target="_blank" rel="noopener noreferrer" class="alt-shipped-ref doc-link">PR #638</a>
            </li>
            <li>
                <div>
                    <h3>Variable-height virtual scrolling</h3>
                    <p>VirtualScroller accepts a getItemSize callback, so lists with rows of different heights can be virtualized, and DataTable row groups now work with virtual scrolling.</p>
                </div>
                <a href="https://github.com/openvi-foundation/openvue/pull/621" target="_blank" rel="noopener noreferrer" class="alt-shipped-ref doc-link">PR #621</a>
            </li>
            <li>
                <div>
                    <h3>DataTable column widths that stick</h3>
                    <p>Resized widths stay with the right column when columns are hidden or shown, and after a reload.</p>
                </div>
                <a href="https://github.com/openvi-foundation/openvue/pull/627" target="_blank" rel="noopener noreferrer" class="alt-shipped-ref doc-link">PR #627</a>
            </li>
            <li>
                <div>
                    <h3>InputNumber typing fixes</h3>
                    <p>Typing after a leading 0 no longer clears the field or shifts currency values.</p>
                </div>
                <a href="https://github.com/openvi-foundation/openvue/pull/665" target="_blank" rel="noopener noreferrer" class="alt-shipped-ref doc-link">PR #665</a>
            </li>
            <li>
                <div>
                    <h3>Accessibility fixes</h3>
                    <p>Menu components no longer announce a bogus nesting level to screen readers.</p>
                </div>
                <a href="https://github.com/openvi-foundation/openvue/pull/645" target="_blank" rel="noopener noreferrer" class="alt-shipped-ref doc-link">PR #645</a>
            </li>
            <li>
                <div>
                    <h3>AI-ready docs</h3>
                    <p>An <NuxtLink to="/mcp" class="doc-link">MCP server</NuxtLink> and <NuxtLink to="/llms" class="doc-link">llms.txt</NuxtLink> give coding assistants accurate props, events and slots for every component.</p>
                </div>
            </li>
        </ul>

        <p class="alt-after">
            You can see the result live in <NuxtLink to="/designer" class="doc-link">the Theme Designer</NuxtLink> and in <a href="https://deni.openvue.dev/" target="_blank" rel="noopener noreferrer" class="doc-link">Deni</a>, a full application
            template built on OpenVue.
        </p>
    </DocSectionText>
</template>

<script>
export default {
    inheritAttrs: false
};
</script>
