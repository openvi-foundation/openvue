import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/treetable';

export default definePreset(aura, {
    css: `
.p-treetable {
    font-size: 0.875rem;
    line-height: 1.25rem;
}
`,
    headerCell: {
        selectedBackground: '{content.background}',
        selectedColor: '{text.color}',
        padding: '0.625rem 0.5rem'
    },
    columnTitle: {
        fontWeight: '500'
    },
    bodyCell: {
        padding: '0.5rem'
    },
    footerCell: {
        padding: '0.5rem'
    },
    columnFooter: {
        fontWeight: '500'
    },
    header: {
        padding: '0.75rem'
    },
    footer: {
        padding: '0.75rem'
    },
    nodeToggleButton: {
        borderRadius: '{border.radius.sm}',
        size: '1.5rem'
    },
    colorScheme: {
        light: {
            root: {
                borderColor: '{content.border.color}'
            },
            row: {
                hoverBackground: 'color-mix(in srgb, {surface.100}, transparent 50%)'
            },
            bodyCell: {
                selectedBorderColor: '{content.border.color}'
            }
        },
        dark: {
            root: {
                borderColor: '{content.border.color}'
            },
            row: {
                hoverBackground: 'color-mix(in srgb, {surface.800}, transparent 50%)'
            },
            bodyCell: {
                selectedBorderColor: '{content.border.color}'
            }
        }
    }
});
