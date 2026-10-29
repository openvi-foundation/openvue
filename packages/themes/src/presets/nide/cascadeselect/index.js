import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/cascadeselect';

export default definePreset(aura, {
    css: `
.p-cascadeselect-label {
    line-height: 1.25rem;
}

.p-cascadeselect:not(.p-cascadeselect-sm, .p-cascadeselect-lg) .p-cascadeselect-label {
    font-size: 0.875rem;
}

.p-cascadeselect-overlay {
    font-size: 0.875rem;
    line-height: 1.25rem;
}
`
});
