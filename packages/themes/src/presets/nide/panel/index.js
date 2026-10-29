import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/panel';

export default definePreset(aura, {
    root: {
        borderRadius: '{border.radius.xl}'
    },
    header: {
        padding: '1.5rem'
    },
    toggleableHeader: {
        padding: '0.875rem 1.5rem'
    },
    content: {
        padding: '0 1.5rem 1.5rem 1.5rem'
    },
    footer: {
        padding: '0 1.5rem 1.5rem 1.5rem'
    },
    css: `
.p-panel {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
}
`
});
