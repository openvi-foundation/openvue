import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/radiobutton';

export default definePreset(aura, {
    root: {
        width: '1.125rem',
        height: '1.125rem',
        checkedBackground: '{form.field.background}',
        checkedHoverBackground: '{form.field.background}',
        focusBorderColor: '{form.field.focus.border.color}',
        checkedBorderColor: '{form.field.border.color}',
        checkedHoverBorderColor: '{form.field.hover.border.color}',
        checkedFocusBorderColor: '{form.field.focus.border.color}',
        sm: {
            width: '1rem',
            height: '1rem'
        },
        lg: {
            width: '1.375rem',
            height: '1.375rem'
        }
    },
    icon: {
        size: '0.625rem',
        checkedColor: '{primary.color}',
        checkedHoverColor: '{primary.color}',
        sm: {
            size: '0.5rem'
        },
        lg: {
            size: '0.75rem'
        }
    }
});
