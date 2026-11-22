<template>
    <DocSectionText v-bind="$attrs">
        <p>It's the right question to ask about any fork. Here is what protects you.</p>

        <div class="alt-guarantees">
            <div class="alt-guarantee">
                <h3>Run by people who depend on it</h3>
                <p>
                    OpenVue is maintained by the <NuxtLink to="/team" class="doc-link">OpenVi Foundation</NuxtLink>, developers who run this library in production themselves, together with outside contributors whose fixes are credited in every
                    release.
                </p>
            </div>
            <div class="alt-guarantee">
                <h3>The whole stack is open</h3>
                <p>The theming engine and the icon set are maintained alongside the components, and OpenVue has no runtime dependency on any PrimeTek package.</p>
            </div>
            <div class="alt-guarantee">
                <h3>Your worst case is fine</h3>
                <p>Everything is MIT. Whatever happens, the version you install keeps working, and anyone can pick the code up and continue it, the same way OpenVue continued PrimeVue 4.</p>
            </div>
            <div class="alt-guarantee">
                <h3>Everything happens in public</h3>
                <p>
                    Issues, pull requests and decisions are on <a href="https://github.com/openvi-foundation/openvue" target="_blank" rel="noopener noreferrer" class="doc-link">GitHub</a>, so you can judge the project's health yourself at any time.
                </p>
            </div>
        </div>
    </DocSectionText>
</template>

<script>
export default {
    inheritAttrs: false
};
</script>
