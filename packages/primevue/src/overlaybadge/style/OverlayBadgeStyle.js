import { style } from '@openuxkit/styles/overlaybadge';
import BaseStyle from '@openvue/core/base/style';

const classes = {
    root: 'p-overlaybadge'
};

export default BaseStyle.extend({
    name: 'overlaybadge',
    style,
    classes
});
