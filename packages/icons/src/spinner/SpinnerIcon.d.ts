import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class SpinnerIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        SpinnerIcon: DefineComponent<SpinnerIcon>;
    }
}

export default SpinnerIcon;
