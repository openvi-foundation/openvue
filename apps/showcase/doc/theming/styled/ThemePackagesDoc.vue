<template>
    <DocSectionText v-bind="$attrs">
        <p>
            Presets and the theming API are distributed in two interchangeable packages. <i>@openvue/themes</i> is the OpenVue branded distribution and the one used throughout this documentation. <i>@openuxkit/themes</i> is the underlying engine
            package that <i>@openvue/themes</i> is built on, published by the OpenUXKit project.
        </p>
        <p>
            The two expose the same presets (Aura, Lara, Material and Nora) and the same utility API (<i>definePreset</i>, <i>usePreset</i>, <i>updatePreset</i>, <i>updatePrimaryPalette</i>, <i>updateSurfacePalette</i>, <i>palette</i>, <i>$dt</i> and
            <i>$t</i>), so every example on this page works with either import path. Pick one and use it consistently, installing both is unnecessary.
        </p>
        <h3>Installation</h3>
        <p>Install whichever package you prefer alongside OpenVue.</p>
        <DocSectionCode :code="code1" hideToggleCode hideStackBlitz />
        <h3>Usage</h3>
        <p>Only the module specifier differs, the imported values are identical.</p>
        <DocSectionCode :code="code2" hideToggleCode importCode hideStackBlitz />
        <h3>Which one to choose</h3>
        <p>
            Use <i>@openvue/themes</i> if you want your dependencies to track OpenVue releases, it is versioned and released together with the component library. Use <i>@openuxkit/themes</i> if you are already consuming other
            <i>@openuxkit/*</i> engine packages directly, or if you want to pick up engine level theming updates without waiting for an OpenVue release.
        </p>
    </DocSectionText>
</template>

<script>
export default {
    data() {
        return {
            code1: {
                basic: `
# OpenVue branded distribution
npm install @openvue/themes

# OpenUXKit engine package
npm install @openuxkit/themes
`
            },
            code2: {
                basic: `
// Using @openvue/themes
import { definePreset } from '@openvue/themes';
import Aura from '@openvue/themes/aura';

// Using @openuxkit/themes
import { definePreset } from '@openuxkit/themes';
import Aura from '@openuxkit/themes/aura';
`
            }
        };
    }
};
</script>
