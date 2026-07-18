<template>
    <DocSectionText v-bind="$attrs">
        <p>
            In traditional 3rd party UI libraries, users are limited to the API provided by component author. This API commonly consists of props, events and slots. Whenever a requirement emerges for a new customization option in the API, the
            component author needs to develop and publish it with a new release.
        </p>
        <p>
            OpenVue's vision is <i>Your components, not ours</i>. The pass through feature is a key element to implement this vision by exposing the component internals in order to apply arbitrary attributes and listeners to the DOM elements. The
            primary advantage of this approach is that it frees you from being restricted by the main component API. We recommend considering the pass-through feature whenever you need to tailor a component that lacks a built-in feature for your
            specific requirement.
        </p>
    </DocSectionText>
</template>
