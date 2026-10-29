import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/contextmenu';

export default definePreset(aura, {
    root: {
        background: '{overlay.popover.background}'
    },
    css: `
.p-contextmenu {
    font-size: 0.875rem;
}

.p-contextmenu .p-contextmenu-item-label {
    line-height: 1.25rem;
}
`
});
