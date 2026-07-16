import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class AngleRightIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        AngleRightIcon: DefineComponent<AngleRightIcon>;
    }
}

export default AngleRightIcon;
