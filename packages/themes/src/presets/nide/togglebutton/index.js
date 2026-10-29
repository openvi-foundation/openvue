import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/togglebutton';

export default definePreset(aura, {
    root: {
        padding: '3px',
        borderRadius: '{border.radius.lg}',
        sm: {
            padding: '3px'
        },
        lg: {
            padding: '3px'
        }
    },
    content: {
        padding: '0.25rem 0.5rem',
        borderRadius: '{border.radius.md}',
        checkedShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)'
    },
    css: `
.p-togglebutton {
    line-height: 1.25rem;
}

.p-togglebutton:not(.p-togglebutton-sm, .p-togglebutton-lg) {
    font-size: 0.875rem;
}
`,
    colorScheme: {
        light: {
            root: {
                color: '{text.muted.color}',
                hoverColor: '{text.color}',
                checkedColor: '{text.color}'
            },
            icon: {
                color: '{text.muted.color}',
                hoverColor: '{text.color}',
                checkedColor: '{text.color}'
            }
        },
        dark: {
            root: {
                background: '{surface.800}',
                checkedBackground: '{surface.800}',
                hoverBackground: '{surface.800}',
                borderColor: '{surface.800}',
                checkedBorderColor: '{surface.800}',
                color: '{text.muted.color}',
                hoverColor: '{text.color}',
                checkedColor: '{text.color}'
            },
            content: {
                checkedBackground: 'color-mix(in srgb, {surface.800}, {surface.0} 5%)',
                checkedShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.15)'
            },
            icon: {
                color: '{text.muted.color}',
                hoverColor: '{text.color}',
                checkedColor: '{text.color}'
            }
        }
    }
});
