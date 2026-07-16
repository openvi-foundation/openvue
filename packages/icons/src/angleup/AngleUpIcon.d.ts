import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class AngleUpIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        AngleUpIcon: DefineComponent<AngleUpIcon>;
    }
}

export default AngleUpIcon;
