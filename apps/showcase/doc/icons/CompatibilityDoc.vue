<template>
    <DocSectionText v-bind="$attrs">
        <p>
            OpenIcons ships a compatibility stylesheet that aliases the legacy <i>pi pi-&#123;icon&#125;</i> class names onto the OpenIcons font. Import it instead of <i>openicons.css</i> and markup written against PrimeIcons keeps rendering without
            changes, which lets an existing project swap the dependency in one step. New code should use the <i>oi</i> prefix.
        </p>
        <p>For projects migrating away from the <i>primeicons</i> package, <i>@openvue/openicons/primeicons.css</i> resolves to the same compatibility layer so existing import statements can stay untouched.</p>
    </DocSectionText>
    <DocSectionCode :code="code" hideToggleCode importCode hideStackBlitz />
</template>

<script>
export default {
    data() {
        return {
            code: {
                basic: "\nimport '@openvue/openicons/openicons-compat.css'\n"
            }
        };
    }
};
</script>
