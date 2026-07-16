import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class SortAmountDownIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        SortAmountDownIcon: DefineComponent<SortAmountDownIcon>;
    }
}

export default SortAmountDownIcon;
