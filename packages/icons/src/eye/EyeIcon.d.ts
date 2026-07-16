import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class EyeIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        EyeIcon: DefineComponent<EyeIcon>;
    }
}

export default EyeIcon;
