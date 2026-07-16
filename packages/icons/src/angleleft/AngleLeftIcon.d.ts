import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class AngleLeftIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        AngleLeftIcon: DefineComponent<AngleLeftIcon>;
    }
}

export default AngleLeftIcon;
