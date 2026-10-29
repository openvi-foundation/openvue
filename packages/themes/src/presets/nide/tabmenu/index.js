import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/tabmenu';

export default definePreset(aura, {
    item: {
        activeBorderColor: '{text.color}',
        activeColor: '{text.color}',
        padding: '0.75rem 1rem',
        fontWeight: '500'
    },
    itemIcon: {
        activeColor: '{text.color}'
    },
    activeBar: {
        height: '2px',
        bottom: '-1px',
        background: '{text.color}'
    }
});
