import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/confirmpopup';

export default definePreset(aura, {
    root: {
        gutter: '{anchor.gutter}'
    },
    content: {
        gap: '0.75rem'
    },
    icon: {
        size: '1.25rem'
    },
    css: `
.p-confirmpopup.p-component::before,
.p-confirmpopup.p-component::after {
    display: none;
}

.p-confirmpopup-message {
    font-size: 0.875rem;
    line-height: 1.25rem;
}
`
});
