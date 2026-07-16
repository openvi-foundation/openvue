import { style } from '@primeuix/styles/ripple';
import BaseStyle from '@openvue/core/base/style';

const classes = {
    root: 'p-ink'
};

export default BaseStyle.extend({
    name: 'ripple-directive',
    style,
    classes
});
