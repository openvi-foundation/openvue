import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/terminal';

export default definePreset(aura, {
    css: `
.p-terminal {
    font-size: 0.875rem;
    line-height: 1.25rem;
}

.p-terminal .p-terminal-prompt-value {
    font-size: inherit;
    line-height: inherit;
}

@media (max-width: 47.99rem) {
    .p-terminal {
        font-size: 1rem;
    }
}
`
});
