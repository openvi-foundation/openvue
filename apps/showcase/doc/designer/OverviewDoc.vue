<template>
    <DocSectionText v-bind="$attrs">
        <p>
            The Theme Designer is a visual editor for the OpenVue theming API. Pick a built-in preset as a foundation, edit primitive, semantic and per-component design tokens, watch the entire documentation site restyle as you type, then export the
            result as a preset file you can drop into your application.
        </p>
        <p>
            It is part of OpenVue and licensed MIT, like the rest of the library. There is no account, no license key, no theme limit and no paid tier. Open it from the
            <i class="pi pi-sliders-h" />
            icon in the top bar on any page.
        </p>
        <p>
            The designer edits a <b>preset</b>, the same object you would otherwise hand-write and pass to <i>definePreset</i>. Nothing it produces is designer-specific: an exported theme is ordinary source code with no runtime dependency on this
            tool.
        </p>
    </DocSectionText>
</template>
