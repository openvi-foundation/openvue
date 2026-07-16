import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class AngleDoubleDownIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        AngleDoubleDownIcon: DefineComponent<AngleDoubleDownIcon>;
    }
}

export default AngleDoubleDownIcon;
