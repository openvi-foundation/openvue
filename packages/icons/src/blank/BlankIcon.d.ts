import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class BlankIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        BlankIcon: DefineComponent<BlankIcon>;
    }
}

export default BlankIcon;
