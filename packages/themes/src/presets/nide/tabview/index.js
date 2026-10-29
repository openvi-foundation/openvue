import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/tabview';

export default definePreset(aura, {
    tab: {
        activeBorderColor: '{text.color}',
        activeColor: '{text.color}'
    }
});
