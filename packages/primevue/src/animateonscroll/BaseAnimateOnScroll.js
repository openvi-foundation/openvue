import BaseDirective from '@openvue/core/basedirective';
import AnimateOnScrollStyle from 'openvue/animateonscroll/style';

const BaseAnimateOnScroll = BaseDirective.extend({
    style: AnimateOnScrollStyle
});

export default BaseAnimateOnScroll;
