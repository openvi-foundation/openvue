import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/datepicker';

export default definePreset(aura, {
    panel: {
        padding: '0.75rem'
    },
    dropdown: {
        width: '2.25rem'
    },
    css: `
.p-datepicker-panel,
.p-datepicker-day-view,
.p-datepicker-time-picker span {
    font-size: 0.875rem;
    line-height: 1.25rem;
}

.p-datepicker-weekday {
    font-size: 0.8rem;
}
`,
    weekDay: {
        fontWeight: '400',
        color: '{text.muted.color}'
    },
    date: {
        borderRadius: '{border.radius.md}'
    },
    selectMonth: {
        borderRadius: '{border.radius.sm}'
    },
    selectYear: {
        borderRadius: '{border.radius.sm}'
    },
    colorScheme: {
        light: {
            dropdown: {
                background: '{form.field.background}',
                hoverBackground: '{surface.100}',
                activeBackground: '{surface.200}',
                color: '{text.color}',
                hoverColor: '{text.color}',
                activeColor: '{text.color}'
            },
            today: {
                background: '{surface.100}',
                color: '{surface.900}'
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
            },
            today: {
                background: '{surface.800}',
                color: '{surface.50}'
            }
        }
    }
});
