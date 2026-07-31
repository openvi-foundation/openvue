import { style } from '@openuxkit/styles/password';
import BaseStyle from '@openvue/core/base/style';

const buttonReset = {
    border: 'none',
    background: 'transparent',
    padding: 0,
    cursor: 'pointer',
    font: 'inherit'
};

const inlineStyles = {
    root: ({ props }) => ({ position: props.appendTo === 'self' ? 'relative' : undefined }),
    maskIcon: buttonReset,
    unmaskIcon: buttonReset,
    clearIcon: buttonReset
};

const iconButtonStyle = `
    .p-password-toggle-mask-icon:focus-visible,
    .p-password-clear-icon:focus-visible {
        outline: var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);
        outline-offset: var(--p-focus-ring-offset);
    }

    .p-password-toggle-mask-icon,
    .p-password-clear-icon {
        border-radius: max(2px, dt('form.field.border.radius') - dt('form.field.padding.x'));
    }
`;

const classes = {
    root: ({ instance }) => [
        'p-password p-component p-inputwrapper',
        {
            'p-inputwrapper-filled': instance.$filled,
            'p-inputwrapper-focus': instance.focused,
            'p-password-fluid': instance.$fluid
        }
    ],
    pcInputText: 'p-password-input',
    maskIcon: 'p-password-toggle-mask-icon p-password-mask-icon',
    unmaskIcon: 'p-password-toggle-mask-icon p-password-unmask-icon',
    clearIcon: 'p-password-clear-icon',
    overlay: 'p-password-overlay p-component',
    content: 'p-password-content',
    meter: 'p-password-meter',
    meterLabel: ({ instance }) => `p-password-meter-label ${instance.meter ? 'p-password-meter-' + instance.meter.strength : ''}`,
    meterText: 'p-password-meter-text'
};

export default BaseStyle.extend({
    name: 'password',
    style: style + iconButtonStyle,
    classes,
    inlineStyles
});
