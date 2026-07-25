<template>
    <DocSectionText v-bind="$attrs">
        <div class="doc-tablewrapper">
            <table class="doc-table">
                <thead>
                    <tr>
                        <th>Option</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><i>[dir]</i></td>
                        <td>Directory to migrate (defaults to the current directory)</td>
                    </tr>
                    <tr>
                        <td><i>--mode &lt;mode&gt;</i></td>
                        <td><i>full</i>, <i>files-only</i> or <i>dry</i>; runs without prompting</td>
                    </tr>
                    <tr>
                        <td><i>--dry</i></td>
                        <td>Report what would change without writing any files</td>
                    </tr>
                    <tr>
                        <td><i>--no-install</i></td>
                        <td>Rewrite files but do not run the package manager install</td>
                    </tr>
                    <tr>
                        <td><i>--no-alias</i></td>
                        <td>Do not add the <i>primevue</i> to <i>openvue</i> override</td>
                    </tr>
                    <tr>
                        <td><i>--force</i></td>
                        <td>Do not stop on an uncommitted git working tree</td>
                    </tr>
                    <tr>
                        <td><i>--yes</i>, <i>-y</i></td>
                        <td>Skip prompts and use defaults (full migration)</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p>
            In interactive mode a dirty git tree only asks for confirmation. Non-interactively (with a mode flag, <i>--yes</i> or in CI) it stops unless you pass <i>--force</i>, so the migration stays a single reviewable, revertible diff.
        </p>
    </DocSectionText>
</template>
