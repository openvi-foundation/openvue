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
import Terminal from 'openvue/terminal';
import TerminalService from 'openvue/terminalservice'
`
            }
        };
    }
};
</script>
