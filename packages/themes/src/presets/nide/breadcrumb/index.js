import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/breadcrumb';

export default definePreset(aura, {
    root: {
        padding: '0',
        background: 'transparent',
        gap: '0.625rem'
    },
    item: {
        borderRadius: '{border.radius.xs}'
    },
    css: `
.p-breadcrumb {
    font-size: 0.875rem;
    line-height: 1.25rem;
}

.p-breadcrumb-list > .p-breadcrumb-item:last-child .p-breadcrumb-item-label {
    color: dt('text.color');
}
`
});
