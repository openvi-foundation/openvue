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
import Accordion from 'openvue/accordion';
import AccordionPanel from 'openvue/accordionpanel';
import AccordionHeader from 'openvue/accordionheader';
import AccordionContent from 'openvue/accordioncontent';
`
            }
        };
    }
};
</script>
