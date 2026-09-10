<template>
    <DocSectionText v-bind="$attrs">
        <p>
            The designer makes no network requests. Themes are stored in this browser's local storage under the <i>openvue-designer</i> key, and every export, share link and migration is computed on your machine. Nothing is uploaded, and there is no
            server that could receive it.
        </p>
        <p>
            The practical consequence is that your themes are tied to this browser on this device. Clearing site data removes them. Export a theme as JSON to keep a durable copy, move it to another machine, or commit it alongside your project.
        </p>
        <p>
            Local storage is finite. If it fills up, or if the browser blocks it in a private window, the designer keeps working for the current session and tells you that changes are not being persisted — export your work when you see that
            warning.
        </p>
        <p>
            Imported files and share links are treated as untrusted input: they are size-limited, checked for a valid schema version, rejected if they contain unsafe object keys, and never executed. A downloaded preset is inert source code that you
            review like any other dependency.
        </p>
    </DocSectionText>
</template>
