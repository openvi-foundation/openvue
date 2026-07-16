import BaseDirective from '@openvue/core/basedirective';
import BadgeDirectiveStyle from 'openvue/badgedirective/style';

const BaseBadgeDirective = BaseDirective.extend({
    style: BadgeDirectiveStyle
});

export default BaseBadgeDirective;
