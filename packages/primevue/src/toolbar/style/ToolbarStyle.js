import { style } from '@primeuix/styles/toolbar';
import BaseStyle from '@openvue/core/base/style';

const classes = {
    root: 'p-toolbar p-component',
    start: 'p-toolbar-start',
    center: 'p-toolbar-center',
    end: 'p-toolbar-end'
};

export default BaseStyle.extend({
    name: 'toolbar',
    style,
    classes
});
