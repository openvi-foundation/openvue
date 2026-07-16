import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class ArrowDownIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        ArrowDownIcon: DefineComponent<ArrowDownIcon>;
    }
}

export default ArrowDownIcon;
