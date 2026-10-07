<template>
    <!-- Kept as static markup rather than v-for so scripts/build-llm-docs.mjs, which parses templates, sees the text. -->
    <DocSectionText v-bind="$attrs">
        <p>A fork is only worth switching to if it keeps shipping. Here are a few highlights from the <a href="https://github.com/openvi-foundation/openvue/blob/master/CHANGELOG.md" target="_blank" rel="noopener noreferrer">changelog</a>.</p>
        <ul class="leading-relaxed">
            <li>
                <b>Theme Designer, free.</b> Edit every design token visually, watch the docs restyle as you type, and export a preset. No account, no license key, runs entirely in your browser.
                <a href="https://github.com/openvi-foundation/openvue/pull/655" target="_blank" rel="noopener noreferrer">#655</a>
            </li>
            <li>
                <b>TreeTable filtering.</b> The filter row and multi-rule filter menu that DataTable already had, styled in all four presets.
                <a href="https://github.com/openvi-foundation/openvue/issues/638" target="_blank" rel="noopener noreferrer">#638</a>
            </li>
            <li>
                <b>Variable-height virtual scrolling.</b> VirtualScroller accepts a getItemSize callback, so lists with rows of different heights can be virtualized, and DataTable row groups now work with virtual scrolling.
                <a href="https://github.com/openvi-foundation/openvue/pull/621" target="_blank" rel="noopener noreferrer">#621</a>
            </li>
            <li>
                <b>DataTable column widths that stick.</b> Resized widths stay with the right column when columns are hidden or shown, and after a reload.
                <a href="https://github.com/openvi-foundation/openvue/pull/627" target="_blank" rel="noopener noreferrer">#627</a>
            </li>
            <li>
                <b>InputNumber typing fixes.</b> Typing after a leading 0 no longer clears the field or shifts currency values.
                <a href="https://github.com/openvi-foundation/openvue/pull/665" target="_blank" rel="noopener noreferrer">#665</a>
            </li>
            <li>
                <b>Accessibility fixes.</b> Menu components no longer announce a bogus nesting level to screen readers.
                <a href="https://github.com/openvi-foundation/openvue/pull/645" target="_blank" rel="noopener noreferrer">#645</a>
            </li>
            <li><b>AI-ready docs.</b> An <NuxtLink to="/mcp" class="doc-link">MCP server</NuxtLink> and <NuxtLink to="/llms" class="doc-link">llms.txt</NuxtLink> give coding assistants accurate props, events and slots for every component.</li>
        </ul>
        <p class="mb-0">
            You can see the result live in <NuxtLink to="/designer" class="doc-link">the Theme Designer</NuxtLink> and in <a href="https://deni.openvue.dev/" target="_blank" rel="noopener noreferrer">Deni</a>, a full application template built on
            OpenVue.
        </p>
    </DocSectionText>
</template>
