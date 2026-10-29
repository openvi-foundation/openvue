import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/panelmenu';

export default definePreset(aura, {
    item: {
        borderRadius: '{border.radius.sm}'
    },
    css: `
.p-panelmenu {
    font-size: 0.875rem;
}

.p-panelmenu .p-panelmenu-header-label,
.p-panelmenu .p-panelmenu-item-label {
    line-height: 1.25rem;
}
`
});
