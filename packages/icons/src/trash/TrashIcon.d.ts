import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class TrashIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        TrashIcon: DefineComponent<TrashIcon>;
    }
}

export default TrashIcon;
