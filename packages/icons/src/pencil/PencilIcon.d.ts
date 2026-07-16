import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class PencilIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        PencilIcon: DefineComponent<PencilIcon>;
    }
}

export default PencilIcon;
