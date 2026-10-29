import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/autocomplete';

export default definePreset(aura, {
    dropdown: {
        width: '2.25rem'
    },
    css: `
.p-autocomplete-input-chip input {
    font-size: 0.875rem;
}

.p-autocomplete-overlay {
    font-size: 0.875rem;
    line-height: 1.25rem;
}

.p-autocomplete-option-group {
    font-size: 0.75rem;
    line-height: 1rem;
}

@media (max-width: 47.99rem) {
    .p-autocomplete-input-chip input {
        font-size: 1rem;
    }
}
`,
    colorScheme: {
        light: {
            dropdown: {
                background: '{form.field.background}',
                hoverBackground: '{surface.100}',
                activeBackground: '{surface.200}',
                color: '{text.color}',
                hoverColor: '{text.color}',
                activeColor: '{text.color}'
            }
        },
        dark: {
            dropdown: {
                background: '{form.field.background}',
                hoverBackground: '{surface.800}',
                activeBackground: '{surface.700}',
                color: '{text.color}',
                hoverColor: '{text.color}',
                activeColor: '{text.color}'
            }
        }
    }
});
