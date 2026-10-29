import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/megamenu';

export default definePreset(aura, {
    overlay: {
        background: '{overlay.popover.background}'
    },
    css: `
.p-megamenu {
    font-size: 0.875rem;
}

.p-megamenu .p-megamenu-item-label {
    line-height: 1.25rem;
}
`
});
