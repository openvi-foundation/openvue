import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/multiselect';

export default definePreset(aura, {
    css: `
.p-multiselect-label {
    line-height: 1.25rem;
}

.p-multiselect:not(.p-multiselect-sm, .p-multiselect-lg) .p-multiselect-label {
    font-size: 0.875rem;
}

.p-multiselect-overlay {
    font-size: 0.875rem;
    line-height: 1.25rem;
}

.p-multiselect-option-group {
    font-size: 0.75rem;
    line-height: 1rem;
}
`
});
