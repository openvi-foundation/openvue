<template>
    <DocSectionText v-bind="$attrs"></DocSectionText>
    <DocSectionCode :code="code" hideToggleCode importCode hideStackBlitz />
</template>

<script>
export default {
    data() {
        return {
            code: {
                basic: `
// import as component
import Badge from 'openvue/badge';
import OverlayBadge from 'openvue/overlaybadge';
`
            }
        };
    }
};
</script>
