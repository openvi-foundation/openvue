import { style } from '@primeuix/styles/chip';
import BaseStyle from '@openvue/core/base/style';

const classes = {
    root: 'p-chip p-component',
    image: 'p-chip-image',
    icon: 'p-chip-icon',
    label: 'p-chip-label',
    removeIcon: 'p-chip-remove-icon'
};

export default BaseStyle.extend({
    name: 'chip',
    style,
    classes
});
