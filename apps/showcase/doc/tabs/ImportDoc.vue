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
import Tabs from 'openvue/tabs';
import TabList from 'openvue/tablist';
import Tab from 'openvue/tab';
import TabPanels from 'openvue/tabpanels';
import TabPanel from 'openvue/tabpanel';
`
            }
        };
    }
};
</script>
