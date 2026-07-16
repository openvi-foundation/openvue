import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class MinusIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        MinusIcon: DefineComponent<MinusIcon>;
    }
}

export default MinusIcon;
