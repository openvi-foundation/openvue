<template>
    <DocSectionText v-bind="$attrs">
        <p>Include the theme preset via a script element, valid options are Aura, Lara, Nora and Material. The theme script must be placed <i>after</i> the OpenVue script, otherwise the preset is not registered on the <i>OpenVue</i> global.</p>
    </DocSectionText>
    <DocSectionCode :code="code" hideToggleCode hideStackBlitz />
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
            }
        };
    }
};
</script>
