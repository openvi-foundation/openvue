<template>
    <DocSectionText v-bind="$attrs">
        <p>
            The webfont loads all 323 glyphs to show one, cannot be multicolored, and places icons in the text layer where screen readers meet them. For Vue 3 applications, <i>@openvue/openicons-vue</i> ships each icon as a tree-shakeable SVG
            component instead, so importing two icons costs under 1KB.
        </p>
    </DocSectionText>
    <DocSectionCode :code="installCode" hideToggleCode importCode hideStackBlitz />
    <DocSectionText>
        <p>
            Components default to <i>1em</i> and <i>currentColor</i>, so they follow the surrounding text exactly as the font does. They are <i>aria-hidden</i> unless given a <i>title</i>, which promotes them to <i>role="img"</i> with an accessible
            name.
        </p>
    </DocSectionText>
    <DocSectionCode :code="code" hideToggleCode hideStackBlitz />
</template>

<script>
export default {
    data() {
        return {
            installCode: {
                basic: `
npm install @openvue/openicons-vue@beta
`
            },
            code: {
                basic: `
<script setup>
import OiCheck from '@openvue/openicons-vue/icons/OiCheck';
<\/script>

<template>
    <OiCheck />
    <OiCheck :size="32" title="Saved" />
<\/template>
`
            }
        };
    }
};
</script>
