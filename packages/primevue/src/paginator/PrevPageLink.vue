<template>
    <button v-ripple :class="cx('prev')" type="button" v-bind="getPTOptions('prev')" data-pc-group-section="pagebutton">
        <component :is="template || 'AngleLeftIcon'" :class="cx('prevIcon')" v-bind="getPTOptions('prevIcon')" />
    </button>
</template>

<script>
import BaseComponent from '@openvue/core/basecomponent';
import AngleLeftIcon from '@openvue/icons/angleleft';
import Ripple from 'openvue/ripple';

export default {
    name: 'PrevPageLink',
    hostName: 'Paginator',
    extends: BaseComponent,
    props: {
        template: {
            type: Function,
            default: null
        }
    },
    methods: {
        getPTOptions(key) {
            return this.ptm(key, {
                context: {
                    disabled: this.$attrs.disabled
                }
            });
        }
    },
    components: {
        AngleLeftIcon: AngleLeftIcon
    },
    directives: {
        ripple: Ripple
    }
};
</script>
