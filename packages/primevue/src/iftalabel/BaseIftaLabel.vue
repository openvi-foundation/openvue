<script>
import BaseComponent from '@openvue/core/basecomponent';
import IftaLabelStyle from 'openvue/iftalabel/style';

export default {
    name: 'BaseIftaLabel',
    extends: BaseComponent,
    style: IftaLabelStyle,
    provide() {
        return {
            $pcIftaLabel: this,
            $parentInstance: this
        };
    }
};
</script>
