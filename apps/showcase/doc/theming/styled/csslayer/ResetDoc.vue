<template>
    <DocSectionText v-bind="$attrs">
        <p>
            In case OpenVue components have visual issues in your application, a Reset CSS may be the culprit. CSS layers would be an efficient solution that involves enabling the OpenVue layer, wrapping the Reset CSS in another layer and defining
            the layer order. This way, your Reset CSS does not get in the way of OpenVue components.
        </p>
        <DocSectionCode :code="code" hideToggleCode importCode hideStackBlitz />
    </DocSectionText>
</template>

<script>
export default {
    data() {
        return {
            checked: false,
            code: {
                basic: `
/* Order */
@layer reset, primevue;

/* Reset CSS */
@layer reset {
    button,
    input {
        /* CSS to Reset */
    }
}
`
            }
        };
    }
};
</script>
