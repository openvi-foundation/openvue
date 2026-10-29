import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/textarea';

export default definePreset(aura, {
    root: {
        paddingY: '0.5rem'
    },
    css: `
.p-textarea {
    min-height: 4rem;
    line-height: 1.25rem;
}

.p-textarea:not(.p-textarea-sm, .p-textarea-lg) {
    font-size: 0.875rem;
}

@media (max-width: 47.99rem) {
    .p-textarea:not(.p-textarea-sm, .p-textarea-lg) {
        font-size: 1rem;
    }
}
`
});
