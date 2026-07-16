import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class RefreshIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        RefreshIcon: DefineComponent<RefreshIcon>;
    }
}

export default RefreshIcon;
