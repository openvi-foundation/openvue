<script>
import BaseComponent from '@openvue/core/basecomponent';
import StepPanelStyle from 'openvue/steppanel/style';

export default {
    name: 'BaseStepPanel',
    extends: BaseComponent,
    props: {
        value: {
            type: [String, Number],
            default: undefined
        },
        asChild: {
            type: Boolean,
            default: false
        },
        as: {
            type: [String, Object],
            default: 'DIV'
        }
    },
    style: StepPanelStyle,
    provide() {
        return {
            $pcStepPanel: this,
            $parentInstance: this
        };
    }
};
</script>
