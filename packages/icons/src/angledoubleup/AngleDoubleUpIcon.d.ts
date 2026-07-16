import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class AngleDoubleUpIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        AngleDoubleUpIcon: DefineComponent<AngleDoubleUpIcon>;
    }
}

export default AngleDoubleUpIcon;
