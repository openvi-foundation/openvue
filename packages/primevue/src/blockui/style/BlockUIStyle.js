import { style } from '@openuxkit/styles/blockui';
import BaseStyle from '@openvue/core/base/style';

const classes = {
    root: 'p-blockui'
};

export default BaseStyle.extend({
    name: 'blockui',
    style,
    classes
});
