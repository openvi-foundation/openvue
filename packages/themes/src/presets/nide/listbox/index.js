import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/listbox';

export default definePreset(aura, {
    css: `
.p-listbox {
    font-size: 0.875rem;
    line-height: 1.25rem;
}

.p-listbox-option-group {
    font-size: 0.75rem;
    line-height: 1rem;
}
`
});
