import { style } from '@openuxkit/styles/buttongroup';
import BaseStyle from '@openvue/core/base/style';

const classes = {
    root: 'p-buttongroup p-component'
};

export default BaseStyle.extend({
    name: 'buttongroup',
    style,
    classes
});
