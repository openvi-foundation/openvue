<template>
    <DocSectionText v-bind="$attrs">
        <p>Migration is a single command, run from the root of your project. For monorepos, run it at the workspace root so overrides land in the right place.</p>
        <p>Run in a terminal, it shows a plan with the detected package manager, PrimeVue version, the files and references it will change, and your git status, then asks how to proceed:</p>
        <ul class="leading-relaxed">
            <li><b>Full migration</b>: rewrite files, add the compatibility override, and run your package manager's install (detected from the lockfile) so the project builds immediately.</li>
            <li><b>Files only</b>: rewrite files and dependencies but leave <i>node_modules</i> alone; you run the install yourself.</li>
            <li><b>Dry run</b>: show everything, write nothing.</li>
        </ul>
        <p>Pass a mode flag (<i>--mode</i>, <i>--dry</i>, <i>--no-install</i>) or <i>--yes</i> to skip the prompt; any non-terminal run such as CI or piped output is non-interactive as well.</p>
        <p>
            <b>Already installed OpenVue yourself?</b> If <i>openvue</i> is found in your <i>package.json</i> or <i>node_modules</i>, the tool switches to sources-only mode: dependencies and <i>node_modules</i> are left completely untouched, no install
            runs, and only source-file imports are rewritten.
        </p>
    </DocSectionText>
    <DocSectionCode :code="code" hideToggleCode hideStackBlitz />
</template>

<script>
export default {
    data() {
        return {
            code: {
                basic: `
npx @openvue/migrate
`
            }
        };
    }
};
</script>
