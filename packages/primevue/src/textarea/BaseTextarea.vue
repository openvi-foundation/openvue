<script>
import BaseInput from '@openvue/core/baseinput';
import TextareaStyle from 'openvue/textarea/style';

export default {
    name: 'BaseTextarea',
    extends: BaseInput,
    props: {
        autoResize: Boolean
    },
    style: TextareaStyle,
    provide() {
        return {
            $pcTextarea: this,
            $parentInstance: this
        };
    }
};
</script>
