import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class StarFillIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        StarFillIcon: DefineComponent<StarFillIcon>;
    }
}

export default StarFillIcon;
