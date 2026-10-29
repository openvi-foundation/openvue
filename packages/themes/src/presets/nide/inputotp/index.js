import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/inputotp';

export default definePreset(aura, {
    input: {
        width: '2.25rem',
        sm: {
            width: '2rem'
        },
        lg: {
            width: '2.5rem'
        }
    }
});
