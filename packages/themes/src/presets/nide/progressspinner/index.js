import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/progressspinner';

export default definePreset(aura, {
    colorScheme: {
        light: {
            root: {
                colorOne: '{primary.color}',
                colorTwo: '{primary.color}',
                colorThree: '{primary.color}',
                colorFour: '{primary.color}'
            }
        },
        dark: {
            root: {
                colorOne: '{primary.color}',
                colorTwo: '{primary.color}',
                colorThree: '{primary.color}',
                colorFour: '{primary.color}'
            }
        }
    }
});
