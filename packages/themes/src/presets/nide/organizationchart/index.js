import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/organizationchart';

export default definePreset(aura, {
    node: {
        borderRadius: '{border.radius.lg}'
    },
    css: `
.p-organizationchart-node {
    font-size: 0.875rem;
    line-height: 1.25rem;
}
`
});
