import BaseDirective from '@openvue/core/basedirective';
import KeyFilterStyle from 'openvue/keyfilter/style';

const BaseKeyFilter = BaseDirective.extend({
    style: KeyFilterStyle
});

export default BaseKeyFilter;
