import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class SortAltIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        SortAltIcon: DefineComponent<SortAltIcon>;
    }
}

export default SortAltIcon;
