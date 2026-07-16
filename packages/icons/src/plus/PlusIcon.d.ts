import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class PlusIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        PlusIcon: DefineComponent<PlusIcon>;
    }
}

export default PlusIcon;
