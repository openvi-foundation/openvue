import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class AngleDoubleRightIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        AngleDoubleRightIcon: DefineComponent<AngleDoubleRightIcon>;
    }
}

export default AngleDoubleRightIcon;
