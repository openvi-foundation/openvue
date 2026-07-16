import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class BanIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        BanIcon: DefineComponent<BanIcon>;
    }
}

export default BanIcon;
