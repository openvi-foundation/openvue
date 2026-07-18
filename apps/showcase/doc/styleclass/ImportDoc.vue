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
import StyleClass from 'openvue/styleclass';

app.directive('styleclass', StyleClass);
`
            }
        };
    }
};
</script>
