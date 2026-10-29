import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/inputtext';

export default definePreset(aura, {
    css: `
.p-inputtext {
    line-height: 1.25rem;
}

.p-inputtext:not(.p-inputtext-sm, .p-inputtext-lg) {
    font-size: 0.875rem;
}

@media (max-width: 47.99rem) {
    .p-inputtext:not(.p-inputtext-sm, .p-inputtext-lg) {
        font-size: 1rem;
    }
}
`
});
