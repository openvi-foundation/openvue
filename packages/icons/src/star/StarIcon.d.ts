import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class StarIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        StarIcon: DefineComponent<StarIcon>;
    }
}

export default StarIcon;
