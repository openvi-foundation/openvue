<script>
import BaseComponent from '@openvue/core/basecomponent';
import InputGroupStyle from 'openvue/inputgroup/style';

export default {
    name: 'BaseInputGroup',
    extends: BaseComponent,
    style: InputGroupStyle,
    provide() {
        return {
            $pcInputGroup: this,
            $parentInstance: this
        };
    }
};
</script>
