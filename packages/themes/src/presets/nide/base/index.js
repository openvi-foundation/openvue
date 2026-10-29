import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/base';

const shadowXs = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
const shadowMd = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)';
const shadowLg = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)';

const neutral = {
    0: '#ffffff',
    50: '{neutral.50}',
    100: '{neutral.100}',
    200: '{neutral.200}',
    300: '{neutral.300}',
    400: '{neutral.400}',
    500: '{neutral.500}',
    600: '{neutral.600}',
    700: '{neutral.700}',
    800: '{neutral.800}',
    900: '{neutral.900}',
    950: '{neutral.950}'
};

export default definePreset(aura, {
    primitive: {
        borderRadius: {
            none: '0',
            xs: '4px',
            sm: '6px',
            md: '8px',
            lg: '10px',
            xl: '14px'
        }
    },
    semantic: {
        transitionDuration: '0.15s',
        focusRing: {
            width: '3px',
            style: 'solid',
            color: 'color-mix(in srgb, {surface.400}, transparent 50%)',
            offset: '0',
            shadow: 'none'
        },
        disabledOpacity: '0.5',
        iconSize: '1rem',
        anchorGutter: '4px',
        primary: {
            50: '{surface.50}',
            100: '{surface.100}',
            200: '{surface.200}',
            300: '{surface.300}',
            400: '{surface.400}',
            500: '{surface.500}',
            600: '{surface.600}',
            700: '{surface.700}',
            800: '{surface.800}',
            900: '{surface.900}',
            950: '{surface.950}'
        },
        // A 20px line + 2 x paddingY + 2px border gives shadcn/ui's 36/32/40px controls.
        formField: {
            paddingX: '0.75rem',
            paddingY: '0.4375rem',
            sm: {
                fontSize: '0.875rem',
                paddingX: '0.75rem',
                paddingY: '0.3125rem'
            },
            lg: {
                fontSize: '0.875rem',
                paddingX: '0.875rem',
                paddingY: '0.5625rem'
            },
            borderRadius: '{border.radius.md}',
            focusRing: {
                width: '3px',
                style: 'solid',
                color: '{focus.ring.color}',
                offset: '0',
                shadow: '{form.field.shadow}'
            },
            transitionDuration: '{transition.duration}'
        },
        list: {
            padding: '0.25rem',
            gap: '1px',
            header: {
                padding: '0.5rem 0.5rem 0.25rem 0.5rem'
            },
            option: {
                padding: '0.375rem 0.5rem',
                borderRadius: '{border.radius.sm}'
            },
            optionGroup: {
                padding: '0.375rem 0.5rem',
                fontWeight: '400'
            }
        },
        content: {
            borderRadius: '{border.radius.md}'
        },
        mask: {
            transitionDuration: '0.15s'
        },
        navigation: {
            list: {
                padding: '0.25rem',
                gap: '1px'
            },
            item: {
                padding: '0.375rem 0.5rem',
                borderRadius: '{border.radius.sm}',
                gap: '0.5rem'
            },
            submenuLabel: {
                padding: '0.375rem 0.5rem',
                fontWeight: '500'
            },
            submenuIcon: {
                size: '0.875rem'
            }
        },
        overlay: {
            select: {
                borderRadius: '{border.radius.md}',
                shadow: shadowMd
            },
            popover: {
                borderRadius: '{border.radius.md}',
                padding: '1rem',
                shadow: shadowMd
            },
            modal: {
                borderRadius: '{border.radius.lg}',
                padding: '1.5rem',
                shadow: shadowLg
            },
            navigation: {
                shadow: shadowMd
            }
        },
        colorScheme: {
            light: {
                surface: neutral,
                primary: {
                    color: '{primary.900}',
                    contrastColor: '{primary.50}',
                    hoverColor: '{primary.800}',
                    activeColor: '{primary.700}'
                },
                highlight: {
                    background: '{surface.100}',
                    focusBackground: '{surface.200}',
                    color: '{surface.900}',
                    focusColor: '{surface.900}'
                },
                focusRing: {
                    color: 'color-mix(in srgb, {surface.400}, transparent 50%)'
                },
                mask: {
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: '{surface.200}'
                },
                formField: {
                    background: '{surface.0}',
                    disabledBackground: '{surface.50}',
                    filledBackground: '{surface.100}',
                    filledHoverBackground: '{surface.100}',
                    filledFocusBackground: '{surface.100}',
                    borderColor: '{surface.200}',
                    hoverBorderColor: '{surface.200}',
                    focusBorderColor: '{surface.400}',
                    invalidBorderColor: '{red.600}',
                    color: '{surface.950}',
                    disabledColor: '{surface.400}',
                    placeholderColor: '{surface.500}',
                    invalidPlaceholderColor: '{surface.500}',
                    floatLabelColor: '{surface.500}',
                    floatLabelFocusColor: '{surface.950}',
                    floatLabelActiveColor: '{surface.500}',
                    floatLabelInvalidColor: '{red.600}',
                    iconColor: '{surface.500}',
                    shadow: shadowXs
                },
                text: {
                    color: '{surface.950}',
                    hoverColor: '{surface.950}',
                    mutedColor: '{surface.500}',
                    hoverMutedColor: '{surface.900}'
                },
                content: {
                    background: '{surface.0}',
                    hoverBackground: '{surface.100}',
                    borderColor: '{surface.200}',
                    color: '{text.color}',
                    hoverColor: '{text.hover.color}'
                },
                overlay: {
                    select: {
                        background: '{surface.0}',
                        borderColor: '{surface.200}',
                        color: '{text.color}'
                    },
                    popover: {
                        background: '{surface.0}',
                        borderColor: '{surface.200}',
                        color: '{text.color}'
                    },
                    modal: {
                        background: '{surface.0}',
                        borderColor: '{surface.200}',
                        color: '{text.color}'
                    }
                },
                list: {
                    option: {
                        focusBackground: '{surface.100}',
                        selectedBackground: '{highlight.background}',
                        selectedFocusBackground: '{highlight.focus.background}',
                        color: '{text.color}',
                        focusColor: '{text.hover.color}',
                        selectedColor: '{highlight.color}',
                        selectedFocusColor: '{highlight.focus.color}',
                        icon: {
                            color: '{surface.500}',
                            focusColor: '{surface.500}'
                        }
                    },
                    optionGroup: {
                        background: 'transparent',
                        color: '{text.muted.color}'
                    }
                },
                navigation: {
                    item: {
                        focusBackground: '{surface.100}',
                        activeBackground: '{surface.100}',
                        color: '{text.color}',
                        focusColor: '{text.hover.color}',
                        activeColor: '{text.hover.color}',
                        icon: {
                            color: '{surface.500}',
                            focusColor: '{surface.500}',
                            activeColor: '{surface.500}'
                        }
                    },
                    submenuLabel: {
                        background: 'transparent',
                        color: '{text.color}'
                    },
                    submenuIcon: {
                        color: '{surface.500}',
                        focusColor: '{surface.500}',
                        activeColor: '{surface.500}'
                    }
                }
            },
            dark: {
                surface: neutral,
                primary: {
                    color: '{primary.200}',
                    contrastColor: '{primary.900}',
                    hoverColor: '{primary.300}',
                    activeColor: '{primary.400}'
                },
                highlight: {
                    background: '{surface.800}',
                    focusBackground: '{surface.700}',
                    color: '{surface.50}',
                    focusColor: '{surface.50}'
                },
                focusRing: {
                    color: 'color-mix(in srgb, {surface.500}, transparent 50%)'
                },
                mask: {
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: '{surface.200}'
                },
                formField: {
                    // Opaque, unlike shadcn/ui's bg-input/30: FloatLabel "on" masks the border with this colour.
                    background: 'color-mix(in srgb, {surface.900}, {surface.0} 3%)',
                    disabledBackground: '{surface.900}',
                    filledBackground: '{surface.800}',
                    filledHoverBackground: '{surface.800}',
                    filledFocusBackground: '{surface.800}',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    hoverBorderColor: 'rgba(255, 255, 255, 0.15)',
                    focusBorderColor: '{surface.500}',
                    invalidBorderColor: '{red.400}',
                    color: '{surface.50}',
                    disabledColor: '{surface.500}',
                    placeholderColor: '{surface.400}',
                    invalidPlaceholderColor: '{surface.400}',
                    floatLabelColor: '{surface.400}',
                    floatLabelFocusColor: '{surface.50}',
                    floatLabelActiveColor: '{surface.400}',
                    floatLabelInvalidColor: '{red.400}',
                    iconColor: '{surface.400}',
                    shadow: shadowXs
                },
                text: {
                    color: '{surface.50}',
                    hoverColor: '{surface.50}',
                    mutedColor: '{surface.400}',
                    hoverMutedColor: '{surface.200}'
                },
                content: {
                    background: '{surface.900}',
                    hoverBackground: '{surface.800}',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: '{text.color}',
                    hoverColor: '{text.hover.color}'
                },
                overlay: {
                    select: {
                        background: '{surface.900}',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: '{text.color}'
                    },
                    popover: {
                        background: '{surface.900}',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: '{text.color}'
                    },
                    modal: {
                        background: '{surface.950}',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: '{text.color}'
                    }
                },
                list: {
                    option: {
                        focusBackground: '{surface.800}',
                        selectedBackground: '{highlight.background}',
                        selectedFocusBackground: '{highlight.focus.background}',
                        color: '{text.color}',
                        focusColor: '{text.hover.color}',
                        selectedColor: '{highlight.color}',
                        selectedFocusColor: '{highlight.focus.color}',
                        icon: {
                            color: '{surface.400}',
                            focusColor: '{surface.400}'
                        }
                    },
                    optionGroup: {
                        background: 'transparent',
                        color: '{text.muted.color}'
                    }
                },
                navigation: {
                    item: {
                        focusBackground: '{surface.800}',
                        activeBackground: '{surface.800}',
                        color: '{text.color}',
                        focusColor: '{text.hover.color}',
                        activeColor: '{text.hover.color}',
                        icon: {
                            color: '{surface.400}',
                            focusColor: '{surface.400}',
                            activeColor: '{surface.400}'
                        }
                    },
                    submenuLabel: {
                        background: 'transparent',
                        color: '{text.color}'
                    },
                    submenuIcon: {
                        color: '{surface.400}',
                        focusColor: '{surface.400}',
                        activeColor: '{surface.400}'
                    }
                }
            }
        }
    }
});
