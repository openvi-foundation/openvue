import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/menubar';

export default definePreset(aura, {
    root: {
        gap: '0.25rem',
        padding: '0.25rem'
    },
    submenu: {
        background: '{overlay.popover.background}'
    },
    baseItem: {
        borderRadius: '{border.radius.sm}',
        padding: '0.25rem 0.5rem'
    },
    mobileButton: {
        borderRadius: '{border.radius.md}'
    },
    css: `
.p-menubar {
    box-shadow: dt('form.field.shadow');
    font-size: 0.875rem;
}

.p-menubar .p-menubar-item-label {
    line-height: 1.25rem;
}
`
});
