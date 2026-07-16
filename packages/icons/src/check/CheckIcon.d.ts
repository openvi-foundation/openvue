import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class CheckIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        CheckIcon: DefineComponent<CheckIcon>;
    }
}

export default CheckIcon;
