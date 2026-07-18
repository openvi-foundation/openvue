<template>
    <DocSectionText v-bind="$attrs" />
    <DocSectionCode :code="code" hideToggleCode importCode hideStackBlitz />
</template>

<script>
export default {
    data() {
        return {
            code: {
                basic: `
import InputGroup from 'openvue/inputgroup';
import InputGroupAddon from 'openvue/inputgroupaddon';
`
            }
        };
    }
};
</script>
