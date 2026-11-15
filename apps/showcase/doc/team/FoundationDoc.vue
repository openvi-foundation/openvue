<template>
    <DocSectionText v-bind="$attrs">
        <p>
            OpenVue is one of four libraries the foundation maintains. The other three are the parts OpenVue is built on or ships with, so the whole stack is developed in the open by the same people and nothing critical resolves from a scope we do
            not control.
        </p>

        <div class="alt-guarantees">
            <div class="alt-guarantee">
                <h3><a href="https://openvi.dev/projects/openux" target="_blank" rel="noopener noreferrer" class="doc-link">OpenUXKit</a></h3>
                <p>The framework-agnostic theming engine behind OpenVue, forked from PrimeUIX. Design tokens, presets and styled mode run on it.</p>
            </div>
            <div class="alt-guarantee">
                <h3><a href="https://openicons.openvue.dev" target="_blank" rel="noopener noreferrer" class="doc-link">OpenIcons</a></h3>
                <p>The MIT-licensed icon set used across these docs, forked from PrimeIcons.</p>
            </div>
            <div class="alt-guarantee">
                <h3><a href="https://openvolt.openvue.dev" target="_blank" rel="noopener noreferrer" class="doc-link">OpenVolt</a></h3>
                <p>Tailwind CSS components built on OpenVue that you copy into your project and own, forked from PrimeVue Volt.</p>
            </div>
        </div>

        <p class="alt-after">
            How the foundation is run, who has commit access and how decisions are made is documented on openvi.dev: read the <a href="https://openvi.dev/about" target="_blank" rel="noopener noreferrer" class="doc-link">about page</a> and the
            <a href="https://openvi.dev/governance" target="_blank" rel="noopener noreferrer" class="doc-link">governance model</a>.
        </p>
    </DocSectionText>
</template>

<script>
export default {
    inheritAttrs: false
};
</script>
