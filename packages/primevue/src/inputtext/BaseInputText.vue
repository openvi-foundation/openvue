<script>
import BaseInput from '@openvue/core/baseinput';
import InputTextStyle from 'openvue/inputtext/style';

export default {
    name: 'BaseInputText',
    extends: BaseInput,
    style: InputTextStyle,
    provide() {
        return {
            $pcInputText: this,
            $parentInstance: this
        };
    }
};
</script>
