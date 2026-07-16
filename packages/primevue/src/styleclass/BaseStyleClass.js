import BaseDirective from '@openvue/core/basedirective';
import StyleClassStyle from 'openvue/styleclass/style';

const BaseStyleClass = BaseDirective.extend({
    style: StyleClassStyle
});

export default BaseStyleClass;
