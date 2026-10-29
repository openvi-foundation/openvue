import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/badge';

export default definePreset(aura, {
    root: {
        fontWeight: '500',
        minWidth: '1.375rem',
        height: '1.375rem'
    },
    colorScheme: {
        light: {
            secondary: {
                background: '{surface.100}',
                color: '{surface.900}'
            },
            success: {
                background: '{green.700}',
                color: '#ffffff'
            },
            info: {
                background: '{blue.600}',
                color: '#ffffff'
            },
            warn: {
                background: '{amber.400}',
                color: '{amber.950}'
            },
            danger: {
                background: '{red.600}',
                color: '#ffffff'
            }
        },
        dark: {
            secondary: {
                background: '{surface.800}',
                color: '{surface.50}'
            },
            info: {
                background: '{blue.400}',
                color: '{blue.950}'
            },
            warn: {
                background: '{amber.400}',
                color: '{amber.950}'
            },
            // Opaque, because OverlayBadge sits on icons and avatars.
            danger: {
                background: 'color-mix(in srgb, {red.400}, {surface.950} 40%)',
                color: '#ffffff'
            }
        }
    }
});
