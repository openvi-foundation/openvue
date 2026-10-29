import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/inlinemessage';

const card = { light: '{surface.0}', dark: '{surface.900}' };

function severity(color, scheme) {
    return {
        background: card[scheme],
        borderColor: '{content.border.color}',
        color,
        shadow: 'none'
    };
}

export default definePreset(aura, {
    root: {
        borderRadius: '{border.radius.lg}'
    },
    text: {
        fontWeight: '400'
    },
    css: `
.p-inlinemessage-text {
    font-size: 0.875rem;
}
`,
    colorScheme: {
        light: {
            info: severity('{blue.600}', 'light'),
            success: severity('{green.700}', 'light'),
            warn: severity('{amber.700}', 'light'),
            error: severity('{red.600}', 'light'),
            secondary: severity('{text.color}', 'light')
        },
        dark: {
            info: severity('{blue.400}', 'dark'),
            success: severity('{green.400}', 'dark'),
            warn: severity('{amber.400}', 'dark'),
            error: severity('{red.400}', 'dark'),
            secondary: severity('{text.color}', 'dark')
        }
    }
});
