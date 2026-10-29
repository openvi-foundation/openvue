import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/paginator';

export default definePreset(aura, {
    root: {
        padding: '0.5rem 1rem',
        gap: '0.25rem'
    },
    navButton: {
        selectedBackground: '{content.background}',
        color: '{text.color}',
        hoverColor: '{text.color}',
        selectedColor: '{text.color}',
        width: '2.25rem',
        height: '2.25rem',
        borderRadius: '{border.radius.md}'
    },
    css: `
.p-paginator {
    font-size: 0.875rem;
}

.p-paginator-page.p-paginator-page-selected {
    box-shadow: inset 0 0 0 1px dt('form.field.border.color'), dt('form.field.shadow');
}

.p-paginator-page.p-paginator-page-selected:focus-visible {
    box-shadow: inset 0 0 0 1px dt('form.field.focus.border.color');
}
`
});
