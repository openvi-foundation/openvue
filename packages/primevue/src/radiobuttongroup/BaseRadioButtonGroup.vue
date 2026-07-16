<script>
import BaseEditableHolder from '@openvue/core/baseeditableholder';
import RadioButtonGroupStyle from 'openvue/radiobuttongroup/style';

export default {
    name: 'BaseRadioButtonGroup',
    extends: BaseEditableHolder,
    style: RadioButtonGroupStyle,
    provide() {
        return {
            $pcRadioButtonGroup: this,
            $parentInstance: this
        };
    }
};
</script>
