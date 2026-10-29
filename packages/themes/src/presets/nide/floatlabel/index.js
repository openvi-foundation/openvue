import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/floatlabel';

export default definePreset(aura, {
    css: `
.p-floatlabel label {
    font-size: 0.875rem;
}
`
});
