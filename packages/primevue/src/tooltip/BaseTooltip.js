import BaseDirective from '@openvue/core/basedirective';
import TooltipStyle from 'openvue/tooltip/style';

const BaseTooltip = BaseDirective.extend({
    style: TooltipStyle
});

export default BaseTooltip;
