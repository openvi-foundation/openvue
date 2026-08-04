<template>
    <DocSectionText v-bind="$attrs">
        <p>CSS file of the icon library needs to be imported at the entry point of your application.</p>
        <p>
            This stylesheet defines the <i>oi</i> prefix only. If your application still uses <i>pi</i> class names, from markup written against PrimeIcons or from the <NuxtLink to="/icons#constants">constants API</NuxtLink>, import the compatibility
            stylesheet instead.
        </p>
    </DocSectionText>
    <DocSectionCode :code="code" hideToggleCode importCode hideStackBlitz />
</template>

<script>
export default {
    data() {
        return {
            code: {
                basic: "\nimport '@openvue/openicons/openicons.css'\n"
            }
        };
    }
};
</script>
