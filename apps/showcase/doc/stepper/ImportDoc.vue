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
import Stepper from 'openvue/stepper';
import StepList from 'openvue/steplist';
import StepPanels from 'openvue/steppanels';
import StepItem from 'openvue/stepitem';
import Step from 'openvue/step';
import StepPanel from 'openvue/steppanel';
`
            }
        };
    }
};
</script>
