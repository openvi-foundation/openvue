<script>
import BaseComponent from '@openvue/core/basecomponent';
import PanelMenuStyle from 'openvue/panelmenu/style';

export default {
    name: 'BasePanelMenu',
    extends: BaseComponent,
    props: {
        model: {
            type: Array,
            default: null
        },
        expandedKeys: {
            type: Object,
            default: null
        },
        multiple: {
            type: Boolean,
            default: false
        },
        tabindex: {
            type: Number,
            default: 0
        }
    },
    style: PanelMenuStyle,
    provide() {
        return {
            $pcPanelMenu: this,
            $parentInstance: this
        };
    }
};
</script>
