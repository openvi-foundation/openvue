import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/card';

export default definePreset(aura, {
    root: {
        borderRadius: '{border.radius.xl}'
    },
    body: {
        padding: '1.5rem',
        gap: '1.5rem'
    },
    caption: {
        gap: '0.5rem'
    },
    title: {
        fontSize: '1rem',
        fontWeight: '600'
    },
    colorScheme: {
        light: {
            root: {
                background: '{surface.0}'
            }
        },
        dark: {
            root: {
                background: '{surface.900}'
            }
        }
    },
    css: `
.p-card {
    border: 1px solid dt('content.border.color');
}

.p-card-title {
    line-height: 1;
}

.p-card-subtitle {
    font-size: 0.875rem;
    line-height: 1.25rem;
}
`
});
