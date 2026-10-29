import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/steps';

export default definePreset(aura, {
    itemLabel: {
        activeColor: '{text.color}'
    },
    itemNumber: {
        activeBackground: '{primary.color}',
        activeBorderColor: '{primary.color}',
        activeColor: '{primary.contrast.color}',
        fontSize: '0.875rem',
        shadow: 'none'
    },
    css: `
.p-steps .p-steps-item-number {
    border-width: 1px;
}

.p-steps .p-steps-item::before {
    border-top-width: 1px;
}

.p-steps-item-label {
    font-size: 0.875rem;
    line-height: 1.25rem;
}
`
});
