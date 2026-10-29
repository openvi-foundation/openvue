import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/slider';

export default definePreset(aura, {
    track: {
        borderRadius: '9999px',
        size: '0.375rem'
    },
    handle: {
        width: '1rem',
        height: '1rem',
        background: '{primary.color}',
        hoverBackground: '{primary.color}',
        content: {
            width: 'calc(1rem - 2px)',
            height: 'calc(1rem - 2px)',
            shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)'
        },
        focusRing: {
            width: '4px'
        }
    },
    colorScheme: {
        light: {
            track: {
                background: '{surface.100}'
            },
            handle: {
                content: {
                    background: '{surface.0}',
                    hoverBackground: '{surface.0}'
                }
            }
        },
        dark: {
            track: {
                background: '{surface.800}'
            },
            handle: {
                content: {
                    background: '{surface.0}',
                    hoverBackground: '{surface.0}'
                }
            }
        }
    },
    css: `
.p-slider:not(.p-disabled) .p-slider-handle:hover {
    box-shadow: 0 0 0 4px dt('focus.ring.color');
}
`
});
