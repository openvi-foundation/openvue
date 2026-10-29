import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/popover';

export default definePreset(aura, {
    root: {
        gutter: '{anchor.gutter}'
    },
    css: `
.p-popover.p-component::before,
.p-popover.p-component::after {
    display: none;
}
`
});
