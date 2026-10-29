import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/confirmdialog';

export default definePreset(aura, {
    icon: {
        size: '1.5rem'
    },
    content: {
        gap: '0.75rem'
    },
    css: `
.p-confirmdialog-message {
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: dt('text.muted.color');
}
`
});
