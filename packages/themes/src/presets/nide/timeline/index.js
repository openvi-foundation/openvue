import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/timeline';

export default definePreset(aura, {
    eventMarker: {
        borderWidth: '1px',
        content: {
            insetShadow: 'none'
        }
    },
    eventConnector: {
        size: '1px'
    }
});
