import { definePreset } from '@openuxkit/styled';
import aura from '@openuxkit/themes/aura/tabs';

export default definePreset(aura, {
    tablist: {
        borderWidth: '0'
    },
    tab: {
        borderWidth: '1px',
        borderColor: 'transparent',
        hoverBorderColor: 'transparent',
        activeBorderColor: 'transparent',
        color: '{text.muted.color}',
        hoverColor: '{text.color}',
        activeColor: '{text.color}',
        padding: '0.25rem 0.5rem',
        fontWeight: '500',
        margin: '0',
        gap: '0.375rem',
        focusRing: {
            offset: '0'
        }
    },
    tabpanel: {
        background: 'transparent',
        padding: '0.5rem 0 0 0'
    },
    navButton: {
        background: '{tabs.tablist.background}',
        width: '2rem'
    },
    // Tabs positions the bar from script, so it stays in the DOM at zero height.
    activeBar: {
        height: '0',
        bottom: '0',
        background: 'transparent'
    },
    colorScheme: {
        light: {
            tablist: {
                background: '{surface.100}'
            },
            tab: {
                background: 'transparent',
                hoverBackground: 'transparent',
                activeBackground: '{surface.0}'
            },
            navButton: {
                shadow: '0px 0px 10px 50px color-mix(in srgb, {surface.100}, transparent 40%)'
            }
        },
        dark: {
            tablist: {
                background: '{surface.800}'
            },
            tab: {
                background: 'transparent',
                hoverBackground: 'transparent',
                activeBackground: 'color-mix(in srgb, {surface.800}, {surface.0} 5%)',
                activeBorderColor: 'rgba(255, 255, 255, 0.15)'
            },
            navButton: {
                shadow: '0px 0px 10px 50px color-mix(in srgb, {surface.800}, transparent 40%)'
            }
        }
    },
    css: `
.p-tablist {
    background: transparent;
}

.p-tablist-tab-list {
    width: fit-content;
    padding: 3px;
    border-radius: dt('border.radius.lg');
    background: dt('tabs.tablist.background');
}

.p-tablist-prev-button {
    border-start-start-radius: dt('border.radius.lg');
    border-end-start-radius: dt('border.radius.lg');
}

.p-tablist-next-button {
    border-start-end-radius: dt('border.radius.lg');
    border-end-end-radius: dt('border.radius.lg');
}

.p-tab {
    flex-grow: 1;
    border-radius: dt('border.radius.md');
    font-size: 0.875rem;
    line-height: 1.25rem;
}

.p-tab-active {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
}
`
});
