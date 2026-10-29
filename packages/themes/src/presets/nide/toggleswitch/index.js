import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/toggleswitch';

export default definePreset(aura, {
    root: {
        width: '2rem',
        height: '1.15rem',
        borderRadius: '9999px',
        gap: '1px',
        slideDuration: '0.15s'
    },
    handle: {
        size: '1rem'
    },
    colorScheme: {
        light: {
            root: {
                background: '{surface.200}',
                hoverBackground: '{surface.200}',
                disabledBackground: '{surface.100}',
                checkedBackground: '{primary.color}',
                checkedHoverBackground: '{primary.color}'
            },
            handle: {
                background: '{surface.0}',
                hoverBackground: '{surface.0}',
                disabledBackground: '{surface.300}',
                checkedBackground: '{surface.0}',
                checkedHoverBackground: '{surface.0}',
                color: '{text.muted.color}',
                hoverColor: '{text.muted.color}',
                checkedColor: '{primary.color}',
                checkedHoverColor: '{primary.color}'
            }
        },
        dark: {
            root: {
                background: 'rgba(255, 255, 255, 0.12)',
                hoverBackground: 'rgba(255, 255, 255, 0.12)',
                disabledBackground: '{surface.800}',
                checkedBackground: '{primary.color}',
                checkedHoverBackground: '{primary.color}'
            },
            handle: {
                background: '{surface.50}',
                hoverBackground: '{surface.50}',
                disabledBackground: '{surface.600}',
                checkedBackground: '{primary.contrast.color}',
                checkedHoverBackground: '{primary.contrast.color}',
                color: '{surface.900}',
                hoverColor: '{surface.900}',
                checkedColor: '{primary.color}',
                checkedHoverColor: '{primary.color}'
            }
        }
    }
});
