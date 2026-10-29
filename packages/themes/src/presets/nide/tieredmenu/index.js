import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/tieredmenu';

export default definePreset(aura, {
    root: {
        background: '{overlay.popover.background}'
    },
    css: `
.p-tieredmenu {
    font-size: 0.875rem;
}

.p-tieredmenu .p-tieredmenu-item-label {
    line-height: 1.25rem;
}
`
});
