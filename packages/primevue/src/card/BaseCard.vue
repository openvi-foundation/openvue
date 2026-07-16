<script>
import BaseComponent from '@openvue/core/basecomponent';
import CardStyle from 'openvue/card/style';

export default {
    name: 'BaseCard',
    extends: BaseComponent,
    style: CardStyle,
    provide() {
        return {
            $pcCard: this,
            $parentInstance: this
        };
    }
};
</script>
