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
import Checkbox from 'openvue/checkbox';
import CheckboxGroup from 'openvue/checkboxgroup';
`
            }
        };
    }
};
</script>
