import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class BarsIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        BarsIcon: DefineComponent<BarsIcon>;
    }
}

export default BarsIcon;
