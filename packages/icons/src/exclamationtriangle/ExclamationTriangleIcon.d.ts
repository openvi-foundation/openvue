import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class ExclamationTriangleIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        ExclamationTriangleIcon: DefineComponent<ExclamationTriangleIcon>;
    }
}

export default ExclamationTriangleIcon;
