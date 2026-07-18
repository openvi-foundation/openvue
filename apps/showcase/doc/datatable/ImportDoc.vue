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
import DataTable from 'openvue/datatable';
import Column from 'openvue/column';
import ColumnGroup from 'openvue/columngroup';   // optional
import Row from 'openvue/row';                   // optional
`
            }
        };
    }
};
</script>
