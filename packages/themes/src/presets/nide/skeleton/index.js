import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/skeleton';

export default definePreset(aura, {
    colorScheme: {
        light: {
            root: {
                background: '{surface.100}',
                animationBackground: 'rgba(255, 255, 255, 0.5)'
            }
        },
        dark: {
            root: {
                background: '{surface.800}',
                animationBackground: 'rgba(255, 255, 255, 0.04)'
            }
        }
    }
});
