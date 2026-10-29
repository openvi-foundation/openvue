import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/scrollpanel';

export default definePreset(aura, {
    bar: {
        borderRadius: '9999px'
    },
    colorScheme: {
        light: {
            bar: {
                background: '{surface.200}'
            }
        },
        dark: {
            bar: {
                background: '{surface.700}'
            }
        }
    }
});
