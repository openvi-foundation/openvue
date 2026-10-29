import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/avatar';

export default definePreset(aura, {
    root: {
        color: '{text.color}'
    },
    colorScheme: {
        light: {
            root: {
                background: '{surface.100}'
            }
        },
        dark: {
            root: {
                background: '{surface.800}'
            }
        }
    }
});
