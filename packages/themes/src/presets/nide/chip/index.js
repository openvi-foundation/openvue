import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/chip';

export default definePreset(aura, {
    root: {
        borderRadius: '{border.radius.md}',
        paddingX: '0.625rem',
        paddingY: '0.375rem',
        gap: '0.375rem'
    },
    removeIcon: {
        size: '0.875rem'
    },
    colorScheme: {
        light: {
            root: {
                background: '{surface.100}',
                color: '{surface.900}'
            },
            icon: {
                color: '{surface.900}'
            },
            removeIcon: {
                color: '{surface.500}'
            }
        },
        dark: {
            root: {
                background: '{surface.800}',
                color: '{surface.50}'
            },
            icon: {
                color: '{surface.50}'
            },
            removeIcon: {
                color: '{surface.400}'
            }
        }
    }
});
