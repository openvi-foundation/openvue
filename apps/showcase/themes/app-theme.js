// @ts-ignore
import '@openuxkit/styles'; // When styles change, the app will hot reload.

import { definePreset } from '@openvue/themes';
import Aura from '@openvue/themes/aura';
import { BRAND_PALETTE } from './brand.js';

// The site's starting look: Aura in the OpenVue green. Aura's own colour scheme already matches what the
// configurator builds for a non-noir primary.
export const SitePreset = definePreset(Aura, {
    semantic: {
        primary: BRAND_PALETTE
    }
});

export default {
    preset: SitePreset,
    options: {
        darkModeSelector: '.p-dark',
        /*
         * Component CSS goes into a cascade layer so the utilities in assets/styles/tailwind/main.css
         * outrank it whatever order the build emits the two stylesheets in. The layer names and their
         * order are declared there; changing either means changing both.
         */
        cssLayer: {
            name: 'openvue',
            order: 'tailwind-base, openvue, tailwind-utilities'
        }
    }
};
