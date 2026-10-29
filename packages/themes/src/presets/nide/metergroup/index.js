import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/metergroup';

export default definePreset(aura, {
    root: {
        borderRadius: '9999px'
    },
    css: `
.p-metergroup-label-list {
    font-size: 0.875rem;
    line-height: 1.25rem;
}
`
});
