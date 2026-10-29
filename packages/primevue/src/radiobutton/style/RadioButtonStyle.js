import { style } from '@openuxkit/styles/radiobutton';
import BaseStyle from '@openvue/core/base/style';

// The dot is masked out of a layer covering the ring, so it snaps with the ring at 125%/175% scaling.
// Sizes are reset with the base style's selectors, so custom width/height CSS still wins.
const centredDotStyle = `
    .p-radiobutton-icon {
        position: absolute;
        inset: 0;
        margin: auto;
        width: auto;
        height: auto;
        -webkit-mask-image: radial-gradient(circle closest-side, #000 calc(0.5em - 0.5px), transparent calc(0.5em + 0.5px));
        mask-image: radial-gradient(circle closest-side, #000 calc(0.5em - 0.5px), transparent calc(0.5em + 0.5px));
    }

    .p-radiobutton-sm .p-radiobutton-icon,
    .p-radiobutton-lg .p-radiobutton-icon {
        width: auto;
        height: auto;
    }
`;

const classes = {
    root: ({ instance, props }) => [
        'p-radiobutton p-component',
        {
            'p-radiobutton-checked': instance.checked,
            'p-disabled': props.disabled,
            'p-invalid': instance.$pcRadioButtonGroup ? instance.$pcRadioButtonGroup.$invalid : instance.$invalid,
            'p-variant-filled': instance.$variant === 'filled',
            'p-radiobutton-sm p-inputfield-sm': props.size === 'small',
            'p-radiobutton-lg p-inputfield-lg': props.size === 'large'
        }
    ],
    box: 'p-radiobutton-box',
    input: 'p-radiobutton-input',
    icon: 'p-radiobutton-icon'
};

export default BaseStyle.extend({
    name: 'radiobutton',
    style: style + centredDotStyle,
    classes
});
