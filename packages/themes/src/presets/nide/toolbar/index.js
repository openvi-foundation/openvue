import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/toolbar';

export default definePreset(aura, {
    root: {
        padding: '0.5rem'
    },
    css: `
.p-toolbar {
    box-shadow: dt('form.field.shadow');
}
`
});
