import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/dialog';

export default definePreset(aura, {
    header: {
        gap: '0.5rem'
    },
    title: {
        fontSize: '1.125rem',
        fontWeight: '600'
    },
    css: `
.p-dialog-title {
    line-height: 1;
}
`
});
