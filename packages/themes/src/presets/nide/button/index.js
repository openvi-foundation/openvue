import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/button';

export default definePreset(aura, {
    root: {
        paddingX: '1rem',
        iconOnlyWidth: '2.25rem',
        sm: {
            paddingX: '0.75rem',
            iconOnlyWidth: '2rem'
        },
        lg: {
            paddingX: '1.5rem',
            iconOnlyWidth: '2.5rem'
        },
        raisedShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)'
    },
    css: `
.p-button {
    line-height: 1.25rem;
}

.p-button:not(.p-button-sm, .p-button-lg) {
    font-size: 0.875rem;
}

.p-button.p-button-outlined {
    background: rgba(255, 255, 255, 0.045);
}

.p-button-outlined:not(.p-button-raised, :focus-visible) {
    box-shadow: dt('form.field.shadow');
}
`,
    colorScheme: {
        light: {
            root: {
                primary: {
                    focusRing: {
                        color: '{focus.ring.color}',
                        shadow: 'none'
                    }
                },
                secondary: {
                    background: '{surface.100}',
                    hoverBackground: 'color-mix(in srgb, {surface.100}, transparent 20%)',
                    activeBackground: 'color-mix(in srgb, {surface.100}, transparent 30%)',
                    borderColor: '{surface.100}',
                    hoverBorderColor: 'transparent',
                    activeBorderColor: 'transparent',
                    color: '{surface.900}',
                    hoverColor: '{surface.900}',
                    activeColor: '{surface.900}',
                    focusRing: {
                        color: '{focus.ring.color}',
                        shadow: 'none'
                    }
                },
                info: {
                    background: '{blue.600}',
                    hoverBackground: '{blue.700}',
                    activeBackground: '{blue.800}',
                    borderColor: '{blue.600}',
                    hoverBorderColor: '{blue.700}',
                    activeBorderColor: '{blue.800}',
                    color: '#ffffff',
                    hoverColor: '#ffffff',
                    activeColor: '#ffffff',
                    focusRing: {
                        color: 'color-mix(in srgb, {blue.600}, transparent 80%)',
                        shadow: 'none'
                    }
                },
                success: {
                    background: '{green.700}',
                    hoverBackground: '{green.800}',
                    activeBackground: '{green.900}',
                    borderColor: '{green.700}',
                    hoverBorderColor: '{green.800}',
                    activeBorderColor: '{green.900}',
                    color: '#ffffff',
                    hoverColor: '#ffffff',
                    activeColor: '#ffffff',
                    focusRing: {
                        color: 'color-mix(in srgb, {green.700}, transparent 80%)',
                        shadow: 'none'
                    }
                },
                warn: {
                    background: '{amber.400}',
                    hoverBackground: '{amber.500}',
                    activeBackground: '{amber.600}',
                    borderColor: '{amber.400}',
                    hoverBorderColor: '{amber.500}',
                    activeBorderColor: '{amber.600}',
                    color: '{amber.950}',
                    hoverColor: '{amber.950}',
                    activeColor: '{amber.950}',
                    focusRing: {
                        color: 'color-mix(in srgb, {amber.500}, transparent 70%)',
                        shadow: 'none'
                    }
                },
                help: {
                    background: '{purple.600}',
                    hoverBackground: '{purple.700}',
                    activeBackground: '{purple.800}',
                    borderColor: '{purple.600}',
                    hoverBorderColor: '{purple.700}',
                    activeBorderColor: '{purple.800}',
                    color: '#ffffff',
                    hoverColor: '#ffffff',
                    activeColor: '#ffffff',
                    focusRing: {
                        color: 'color-mix(in srgb, {purple.600}, transparent 80%)',
                        shadow: 'none'
                    }
                },
                danger: {
                    background: '{red.600}',
                    hoverBackground: '{red.700}',
                    activeBackground: '{red.800}',
                    borderColor: '{red.600}',
                    hoverBorderColor: '{red.700}',
                    activeBorderColor: '{red.800}',
                    color: '#ffffff',
                    hoverColor: '#ffffff',
                    activeColor: '#ffffff',
                    focusRing: {
                        color: 'color-mix(in srgb, {red.600}, transparent 80%)',
                        shadow: 'none'
                    }
                },
                contrast: {
                    focusRing: {
                        color: '{focus.ring.color}',
                        shadow: 'none'
                    }
                }
            },
            outlined: {
                primary: {
                    hoverBackground: '{primary.100}',
                    activeBackground: '{primary.200}',
                    borderColor: '{primary.200}',
                    color: '{primary.color}'
                },
                secondary: {
                    hoverBackground: '{surface.100}',
                    activeBackground: '{surface.200}',
                    borderColor: '{surface.200}',
                    color: '{surface.900}'
                },
                success: {
                    hoverBackground: '{green.50}',
                    activeBackground: '{green.100}',
                    borderColor: '{green.200}',
                    color: '{green.700}'
                },
                info: {
                    hoverBackground: '{blue.50}',
                    activeBackground: '{blue.100}',
                    borderColor: '{blue.200}',
                    color: '{blue.600}'
                },
                warn: {
                    hoverBackground: '{amber.50}',
                    activeBackground: '{amber.100}',
                    borderColor: '{amber.200}',
                    color: '{amber.700}'
                },
                help: {
                    hoverBackground: '{purple.50}',
                    activeBackground: '{purple.100}',
                    borderColor: '{purple.200}',
                    color: '{purple.600}'
                },
                danger: {
                    hoverBackground: '{red.50}',
                    activeBackground: '{red.100}',
                    borderColor: '{red.200}',
                    color: '{red.600}'
                },
                contrast: {
                    hoverBackground: '{surface.100}',
                    activeBackground: '{surface.200}',
                    borderColor: '{surface.950}',
                    color: '{surface.950}'
                },
                plain: {
                    hoverBackground: '{surface.100}',
                    activeBackground: '{surface.200}',
                    borderColor: '{surface.200}',
                    color: '{surface.950}'
                }
            },
            text: {
                primary: {
                    hoverBackground: '{primary.100}',
                    activeBackground: '{primary.200}',
                    color: '{primary.color}'
                },
                secondary: {
                    hoverBackground: '{surface.100}',
                    activeBackground: '{surface.200}',
                    color: '{surface.950}'
                },
                success: {
                    hoverBackground: '{green.50}',
                    activeBackground: '{green.100}',
                    color: '{green.700}'
                },
                info: {
                    hoverBackground: '{blue.50}',
                    activeBackground: '{blue.100}',
                    color: '{blue.600}'
                },
                warn: {
                    hoverBackground: '{amber.50}',
                    activeBackground: '{amber.100}',
                    color: '{amber.700}'
                },
                help: {
                    hoverBackground: '{purple.50}',
                    activeBackground: '{purple.100}',
                    color: '{purple.600}'
                },
                danger: {
                    hoverBackground: '{red.50}',
                    activeBackground: '{red.100}',
                    color: '{red.600}'
                },
                contrast: {
                    hoverBackground: '{surface.100}',
                    activeBackground: '{surface.200}',
                    color: '{surface.950}'
                },
                plain: {
                    hoverBackground: '{surface.100}',
                    activeBackground: '{surface.200}',
                    color: '{surface.950}'
                }
            }
        },
        dark: {
            root: {
                primary: {
                    focusRing: {
                        color: '{focus.ring.color}',
                        shadow: 'none'
                    }
                },
                secondary: {
                    background: '{surface.800}',
                    hoverBackground: 'color-mix(in srgb, {surface.800}, transparent 20%)',
                    activeBackground: 'color-mix(in srgb, {surface.800}, transparent 30%)',
                    borderColor: '{surface.800}',
                    hoverBorderColor: 'transparent',
                    activeBorderColor: 'transparent',
                    color: '{surface.50}',
                    hoverColor: '{surface.50}',
                    activeColor: '{surface.50}',
                    focusRing: {
                        color: '{focus.ring.color}',
                        shadow: 'none'
                    }
                },
                info: {
                    background: '{blue.400}',
                    hoverBackground: '{blue.300}',
                    activeBackground: '{blue.200}',
                    borderColor: '{blue.400}',
                    hoverBorderColor: '{blue.300}',
                    activeBorderColor: '{blue.200}',
                    color: '{blue.950}',
                    hoverColor: '{blue.950}',
                    activeColor: '{blue.950}',
                    focusRing: {
                        color: 'color-mix(in srgb, {blue.400}, transparent 60%)',
                        shadow: 'none'
                    }
                },
                success: {
                    focusRing: {
                        color: 'color-mix(in srgb, {green.400}, transparent 60%)',
                        shadow: 'none'
                    }
                },
                warn: {
                    background: '{amber.400}',
                    hoverBackground: '{amber.300}',
                    activeBackground: '{amber.200}',
                    borderColor: '{amber.400}',
                    hoverBorderColor: '{amber.300}',
                    activeBorderColor: '{amber.200}',
                    color: '{amber.950}',
                    hoverColor: '{amber.950}',
                    activeColor: '{amber.950}',
                    focusRing: {
                        color: 'color-mix(in srgb, {amber.400}, transparent 60%)',
                        shadow: 'none'
                    }
                },
                help: {
                    focusRing: {
                        color: 'color-mix(in srgb, {purple.400}, transparent 60%)',
                        shadow: 'none'
                    }
                },
                danger: {
                    background: 'color-mix(in srgb, {red.400}, transparent 40%)',
                    hoverBackground: 'color-mix(in srgb, {red.400}, transparent 30%)',
                    activeBackground: 'color-mix(in srgb, {red.400}, transparent 20%)',
                    borderColor: 'transparent',
                    hoverBorderColor: 'transparent',
                    activeBorderColor: 'transparent',
                    color: '#ffffff',
                    hoverColor: '#ffffff',
                    activeColor: '#ffffff',
                    focusRing: {
                        color: 'color-mix(in srgb, {red.400}, transparent 60%)',
                        shadow: 'none'
                    }
                },
                contrast: {
                    focusRing: {
                        color: '{focus.ring.color}',
                        shadow: 'none'
                    }
                }
            },
            outlined: {
                primary: {
                    hoverBackground: 'color-mix(in srgb, {primary.color}, transparent 92%)',
                    activeBackground: 'color-mix(in srgb, {primary.color}, transparent 84%)',
                    borderColor: '{primary.700}',
                    color: '{primary.color}'
                },
                secondary: {
                    hoverBackground: 'rgba(255, 255, 255, 0.075)',
                    activeBackground: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    color: '{surface.50}'
                },
                success: {
                    hoverBackground: 'color-mix(in srgb, {green.400}, transparent 88%)'
                },
                warn: {
                    hoverBackground: 'color-mix(in srgb, {amber.400}, transparent 88%)',
                    activeBackground: 'color-mix(in srgb, {amber.400}, transparent 84%)',
                    borderColor: '{amber.700}',
                    color: '{amber.400}'
                },
                info: {
                    hoverBackground: 'color-mix(in srgb, {blue.400}, transparent 88%)',
                    activeBackground: 'color-mix(in srgb, {blue.400}, transparent 84%)',
                    borderColor: '{blue.700}',
                    color: '{blue.400}'
                },
                help: {
                    hoverBackground: 'color-mix(in srgb, {purple.400}, transparent 88%)'
                },
                danger: {
                    hoverBackground: 'color-mix(in srgb, {red.400}, transparent 88%)'
                },
                plain: {
                    hoverBackground: '{surface.800}',
                    activeBackground: '{surface.700}',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    color: '{surface.50}'
                }
            },
            text: {
                primary: {
                    hoverBackground: 'color-mix(in srgb, {primary.color}, transparent 92%)',
                    activeBackground: 'color-mix(in srgb, {primary.color}, transparent 84%)',
                    color: '{primary.color}'
                },
                secondary: {
                    hoverBackground: '{surface.800}',
                    activeBackground: '{surface.700}',
                    color: '{surface.50}'
                },
                warn: {
                    hoverBackground: 'color-mix(in srgb, {amber.400}, transparent 96%)',
                    activeBackground: 'color-mix(in srgb, {amber.400}, transparent 84%)',
                    color: '{amber.400}'
                },
                info: {
                    hoverBackground: 'color-mix(in srgb, {blue.400}, transparent 96%)',
                    activeBackground: 'color-mix(in srgb, {blue.400}, transparent 84%)',
                    color: '{blue.400}'
                },
                plain: {
                    hoverBackground: '{surface.800}',
                    activeBackground: '{surface.700}',
                    color: '{surface.50}'
                }
            }
        }
    }
});
