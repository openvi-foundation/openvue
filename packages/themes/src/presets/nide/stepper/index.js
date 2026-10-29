import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/stepper';

export default definePreset(aura, {
    separator: {
        size: '1px',
        margin: '0 0 0 1.5625rem'
    },
    stepTitle: {
        activeColor: '{text.color}'
    },
    stepNumber: {
        activeBackground: '{primary.color}',
        activeBorderColor: '{primary.color}',
        activeColor: '{primary.contrast.color}',
        fontSize: '0.875rem',
        shadow: 'none'
    },
    css: `
.p-stepper .p-step-number {
    border-width: 1px;
}

.p-step-title {
    font-size: 0.875rem;
    line-height: 1.25rem;
}
`
});
