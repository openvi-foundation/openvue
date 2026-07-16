<script>
import BaseComponent from '@openvue/core/basecomponent';
import DynamicDialogStyle from 'openvue/dynamicdialog/style';

export default {
    name: 'BaseDynamicDialog',
    extends: BaseComponent,
    props: {},
    style: DynamicDialogStyle,
    provide() {
        return {
            $pcDynamicDialog: this,
            $parentInstance: this
        };
    }
};
</script>
