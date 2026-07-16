<script>
import BaseComponent from '@openvue/core/basecomponent';
import ProgressSpinnerStyle from 'openvue/progressspinner/style';

export default {
    name: 'BaseProgressSpinner',
    extends: BaseComponent,
    props: {
        strokeWidth: {
            type: String,
            default: '2'
        },
        fill: {
            type: String,
            default: 'none'
        },
        animationDuration: {
            type: String,
            default: '2s'
        }
    },
    style: ProgressSpinnerStyle,
    provide() {
        return {
            $pcProgressSpinner: this,
            $parentInstance: this
        };
    }
};
</script>
