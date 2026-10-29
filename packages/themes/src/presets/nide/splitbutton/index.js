import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/splitbutton';

export default definePreset(aura, {
    root: {
        raisedShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)'
    }
});
