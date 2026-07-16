import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class SortAmountUpAltIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        SortAmountUpAltIcon: DefineComponent<SortAmountUpAltIcon>;
    }
}

export default SortAmountUpAltIcon;
