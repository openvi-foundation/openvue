<script>
import BaseComponent from '@openvue/core/basecomponent';
import ConfirmPopupStyle from 'openvue/confirmpopup/style';

export default {
    name: 'BaseConfirmPopup',
    extends: BaseComponent,
    props: {
        group: String
    },
    style: ConfirmPopupStyle,
    provide() {
        return {
            $pcConfirmPopup: this,
            $parentInstance: this
        };
    }
};
</script>
