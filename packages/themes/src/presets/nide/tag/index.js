import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/tag';

export default definePreset(aura, {
    root: {
        fontSize: '0.75rem',
        fontWeight: '500',
        padding: '0 0.5625rem',
        gap: '0.25rem',
        borderRadius: '9999px',
        roundedBorderRadius: '9999px'
    },
    colorScheme: {
        light: {
            primary: {
                background: '{primary.color}',
                color: '{primary.contrast.color}'
            },
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
            },
            contrast: {
                background: '{surface.950}',
                color: '{surface.0}'
            }
        },
        dark: {
            primary: {
                background: '{primary.color}',
                color: '{primary.contrast.color}'
            },
            secondary: {
                background: '{surface.800}',
                color: '{surface.50}'
            },
            success: {
                background: '{green.400}',
                color: '{green.950}'
            },
            info: {
                background: '{blue.400}',
                color: '{blue.950}'
            },
            warn: {
                background: '{amber.400}',
                color: '{amber.950}'
            },
            danger: {
                background: 'color-mix(in srgb, {red.400}, transparent 40%)',
                color: '#ffffff'
            },
            contrast: {
                background: '{surface.0}',
                color: '{surface.950}'
            }
        }
    },
    // text-box centres the caps rather than a line box the browser rounds to whole pixels.
    css: `
.p-tag {
    min-height: 1.375rem;
    min-height: round(1.375rem, 1px);
    line-height: 1rem;
}

.p-tag-label {
    text-box: trim-both cap alphabetic;
}
`
});
