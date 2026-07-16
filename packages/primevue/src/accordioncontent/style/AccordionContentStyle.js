import BaseStyle from '@openvue/core/base/style';

const classes = {
    root: 'p-accordioncontent',
    contentWrapper: 'p-accordioncontent-wrapper',
    content: 'p-accordioncontent-content'
};

export default BaseStyle.extend({
    name: 'accordioncontent',
    classes
});
