import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/inputnumber';

export default definePreset(aura, {
    colorScheme: {
        light: {
            button: {
                hoverBackground: '{surface.100}',
                activeBackground: '{surface.200}',
                color: '{surface.500}',
                hoverColor: '{surface.950}',
                activeColor: '{surface.950}'
            }
        },
        dark: {
            button: {
                hoverBackground: '{surface.800}',
                activeBackground: '{surface.700}',
                color: '{surface.400}',
                hoverColor: '{surface.50}',
                activeColor: '{surface.50}'
            }
        }
    }
});
