<template>
    <DocSectionText v-bind="$attrs">
        <p>The editor is organised by token collection, matching the theming architecture.</p>
        <ul class="leading-relaxed">
            <li><b>Primitive</b> — the raw palettes and border radii. Values here are plain colours and lengths, referenced by everything else.</li>
            <li><b>Semantic</b> — roles such as <i>primary</i>, <i>formField</i> and the light and dark colour schemes. Most theming work happens here.</li>
            <li><b>Component</b> — tokens for one component at a time. This tab activates on a component's documentation page and selects that component automatically.</li>
            <li><b>Custom</b> — your own tokens, added under <i>extend</i>. Use dot-separated lowercase names such as <i>accent.color</i>.</li>
            <li><b>Settings</b> — preview typography, theme validation and the migration assistant.</li>
        </ul>
        <p>
            Any field accepts either a literal value or a reference to another token in curly braces. Typing an opening brace opens autocompletion over every token in the current theme. Fields whose value resolves to a colour show a swatch, and the
            sort icon moves a token between the shared section and the light or dark colour scheme.
        </p>
        <p>Edits apply live to the whole site, so you are previewing on real components rather than a mock screen. Undo and redo are available with Ctrl+Z and Ctrl+Shift+Z while the editor is open.</p>
    </DocSectionText>
</template>
