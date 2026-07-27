<template>
    <DocSectionText v-bind="$attrs">
        <p>Include the theme preset via a script element, valid options are Aura, Lara, Nora and Material. The theme script must be placed <i>after</i> the OpenVue script, otherwise the preset is not registered on the <i>OpenVue</i> global.</p>
    </DocSectionText>
    <DocSectionCode :code="code" hideToggleCode hideStackBlitz />
    <DocSectionText>
        <p>
            The presets are also served from <i>@openuxkit/themes</i>, the engine package that <i>@openvue/themes</i> is built on. Unlike the module builds these are not drop in replacements over CDN: the files are unminified and the presets register
            on an <i>OpenUXKit</i> global rather than <i>OpenVue</i>, so reference them as <i>OpenUXKit.Themes.Aura</i> when configuring the theme.
        </p>
        <DocSectionCode :code="codeAlt" hideToggleCode hideStackBlitz />
    </DocSectionText>
</template>

<script>
export default {
    data() {
        return {
            code: {
                basic: `
<!-- <script src="https://unpkg.com/@openvue/themes/umd/{preset}.min.js"><\/script> -->

<script src="https://unpkg.com/@openvue/themes/umd/aura.min.js"><\/script>
<script src="https://unpkg.com/@openvue/themes/umd/lara.min.js"><\/script>
<script src="https://unpkg.com/@openvue/themes/umd/nora.min.js"><\/script>
<script src="https://unpkg.com/@openvue/themes/umd/material.min.js"><\/script>
`
            },
            codeAlt: {
                basic: `
<script src="https://unpkg.com/@openuxkit/themes/umd/aura.js"><\/script>

<script>
    app.use(OpenVue.Config, {
        theme: {
            preset: OpenUXKit.Themes.Aura
        }
    });
<\/script>
`
            }
        };
    }
};
</script>
