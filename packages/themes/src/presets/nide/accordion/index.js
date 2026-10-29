import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/accordion';

export default definePreset(aura, {
    header: {
        color: '{text.color}',
        hoverColor: '{text.color}',
        background: 'transparent',
        hoverBackground: 'transparent',
        activeBackground: 'transparent',
        activeHoverBackground: 'transparent',
        padding: '1rem 0',
        fontWeight: '500',
        borderRadius: '{border.radius.md}',
        first: {
            topBorderRadius: '{border.radius.md}'
        },
        last: {
            bottomBorderRadius: '{border.radius.md}',
            activeBottomBorderRadius: '{border.radius.md}'
        },
        toggleIcon: {
            color: '{text.muted.color}',
            hoverColor: '{text.muted.color}',
            activeColor: '{text.muted.color}',
            activeHoverColor: '{text.muted.color}'
        },
        focusRing: {
            offset: '0'
        }
    },
    content: {
        background: 'transparent',
        padding: '0 0 1rem 0'
    },
    css: `
.p-accordionpanel:last-child {
    border-block-end-width: 0;
}

.p-accordionpanel:not(.p-disabled) .p-accordionheader:hover {
    text-decoration: underline;
}

.p-accordionheader {
    font-size: 0.875rem;
    line-height: 1.25rem;
}

.p-accordioncontent-content {
    font-size: 0.875rem;
}
`
});
