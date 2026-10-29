import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/divider';

export default definePreset(aura, {
    content: {
        color: '{text.muted.color}'
    },
    css: `
.p-divider-content {
    font-size: 0.875rem;
    line-height: 1.25rem;
}
`
});
