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
import IconField from 'openvue/iconfield';
import InputIcon from 'openvue/inputicon';
`
            }
        };
    }
};
</script>
