import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/inputchips';

export default definePreset(aura, {
    css: `
.p-inputchips-input-item input {
    font-size: 0.875rem;
}

@media (max-width: 47.99rem) {
    .p-inputchips-input-item input {
        font-size: 1rem;
    }
}
`
});
