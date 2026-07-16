import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class ArrowUpIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        ArrowUpIcon: DefineComponent<ArrowUpIcon>;
    }
}

export default ArrowUpIcon;
