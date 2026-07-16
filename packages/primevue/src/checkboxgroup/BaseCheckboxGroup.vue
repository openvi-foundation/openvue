<script>
import BaseEditableHolder from '@openvue/core/baseeditableholder';
import CheckboxGroupStyle from 'openvue/checkboxgroup/style';

export default {
    name: 'BaseCheckboxGroup',
    extends: BaseEditableHolder,
    style: CheckboxGroupStyle,
    provide() {
        return {
            $pcCheckboxGroup: this,
            $parentInstance: this
        };
    }
};
</script>
