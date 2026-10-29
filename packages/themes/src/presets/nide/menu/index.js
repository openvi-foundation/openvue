import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/menu';

export default definePreset(aura, {
    root: {
        background: '{overlay.popover.background}'
    },
    css: `
.p-menu {
    font-size: 0.875rem;
}

.p-menu .p-menu-item-label {
    line-height: 1.25rem;
}
`
});
