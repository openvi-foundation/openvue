import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class AngleDownIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        AngleDownIcon: DefineComponent<AngleDownIcon>;
    }
}

export default AngleDownIcon;
