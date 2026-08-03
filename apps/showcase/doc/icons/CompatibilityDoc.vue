<template>
    <DocSectionText v-bind="$attrs">
        <p>
            The class prefix changed from <i>pi</i> to <i>oi</i> in this release. Existing markup keeps working through a compatibility stylesheet that aliases every <i>.pi-*</i> class onto the OpenIcons font, so migrating from the
            <i>primeicons</i> package is a one line dependency swap and nothing in your templates has to change.
        </p>
    </DocSectionText>
    <DocSectionCode :code="code" hideToggleCode importCode hideStackBlitz />
    <DocSectionText>
        <p>
            That entry point loads <i>openicons-compat.css</i>, which is also importable directly. To move to the new prefix, import <i>@openvue/openicons/openicons.css</i> instead and rename <i>pi pi-check</i> to <i>oi oi-check</i> throughout. Both
            stylesheets can be loaded at once during a gradual migration.
        </p>
        <p>One icon was removed rather than renamed: <i>pi-prime</i> was the PrimeTek logo mark, which the MIT license does not cover.</p>
        <p>OpenIcons is stewarded by the OpenVi Foundation and is not affiliated with PrimeTek or PrimeUI.</p>
    </DocSectionText>
</template>

<script>
export default {
    data() {
        return {
            code: {
                basic: "\n- import 'primeicons/primeicons.css';\n+ import '@openvue/openicons/primeicons.css';\n"
            }
        };
    }
};
</script>
