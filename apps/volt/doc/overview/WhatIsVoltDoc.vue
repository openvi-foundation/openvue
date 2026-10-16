<template>
    <DocSectionText v-bind="$attrs">
        <p>
            OpenVolt is an open source UI component library implemented with the Unstyled OpenVue components. OpenVolt follows the <b>Code Ownership</b> model where the components live in your application code base as your own UI library rather than
            imported from <i>node_modules</i> as a 3rd party. Main benefit of this approach is full control over styling and ease of customization. Internally an OpenVolt component, wraps its OpenVue counterpart, removes the default design token
            based theming and applies Tailwind utility classes via the pass through attributes feature.
        </p>
        <p>OpenVolt is the community continuation of Volt, originally created by PrimeTek for PrimeVue.</p>
        <img alt="Architecture" src="https://primefaces.org/cdn/primevue/images/volt-architecture.png" class="w-full mb-4" />
        <h3>Unstyled OpenVue</h3>
        <p>
            Each OpenVolt component enables <i>unstyled</i> option on the wrapped OpenVue component, as a result opinionated class names such as <i>p-select</i> and design tokens e.g <i>select.background</i> are turned off. This approach opens up the
            possibility to style OpenVue with an alternative approach. This is where OpenVolt comes in with the power of Tailwind CSS.
        </p>

        <h3>Pass Through</h3>
        <p>
            The pass-through is a OpenVue API to access the internal DOM elements of components to add arbitrary attributes. The most important attribute for OpenVolt is the <i>class</i> to pass Tailwind utilities to the internals. It is highly
            recommended to review the <a href="https://openvue.dev/passthrough" target="_blank" rel="noopener noreferrer">pass-through documentation</a> to learn more about how OpenVolt works.
        </p>

        <h3>Tailwind CSS</h3>
        <p>
            Tailwind CSS v4 is utilized by OpenVolt components along with the <i>tailwindcss-primeui</i> plugin to style the components. The plugin adds custom variants like <i>p-selected</i>, and <i>p-editable</i> to refer to the props and state of
            the components so that the theme object consists of a key-value pair. OpenVolt components implement the Aura theme with Tailwind that serves a boilerplate for your custom designs.
        </p>

        <h3>Updates</h3>
        <p>
            Once the OpenVolt components are located in your application codebase, they are not meant to be updated since their styles are designed to be customized per your requirements. Simply updating the OpenVue version would also update your own
            OpenVolt based components as well for maintenance updates.
        </p>
    </DocSectionText>
</template>
