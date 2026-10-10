<template>
    <DocSectionText id="accessibility" label="Accessibility" v-bind="$attrs">
        <h3>Screen Reader</h3>
        <p>FileUpload uses a hidden native <i>input</i> element with <i>type="file"</i> for screen readers.</p>
        <p>
            Use the <i>inputId</i> property to assign an identifier to the native input so that it can be associated with a custom <i>label</i> element via the <i>for</i> attribute. Note that a <i>label</i> is not keyboard focusable, so when
            replacing the default choose button, provide a focusable element such as a <i>Button</i> that invokes the <i>chooseCallback</i> of the template.
        </p>

        <h3>Keyboard Support</h3>
        <p>Interactive elements of the uploader are buttons, visit the <NuxtLink to="/button/#accessibility">Button</NuxtLink> accessibility section for more information.</p>
    </DocSectionText>
</template>
