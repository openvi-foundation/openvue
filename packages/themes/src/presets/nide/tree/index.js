import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/tree';

export default definePreset(aura, {
    node: {
        borderRadius: '{border.radius.sm}'
    },
    nodeToggleButton: {
        borderRadius: '{border.radius.sm}',
        size: '1.5rem'
    }
});
