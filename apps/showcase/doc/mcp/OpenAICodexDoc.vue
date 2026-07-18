<template>
    <DocSectionText v-bind="$attrs">
        <p>Add the OpenVue MCP server using the CLI or edit <i>~/.codex/config.toml</i> directly.</p>
    </DocSectionText>
    <DocSectionCode :code="code" hideToggle />
    <p class="doc-section-description">See <a href="https://developers.openai.com/codex/mcp/" class="font-medium hover:underline text-primary" target="_blank" rel="noopener noreferrer">OpenAI Codex MCP Documentation</a> for more details.</p>
</template>

<script>
export default {
    name: 'OpenAICodexDoc',
    data() {
        return {
            code: {
                basic: `
# Using the CLI
codex mcp add openvue -- npx -y @openvue/mcp

# Or edit ~/.codex/config.toml
[mcp_servers.openvue]
command = "npx"
args = ["-y", "@openvue/mcp"]
`
            }
        };
    }
};
</script>
