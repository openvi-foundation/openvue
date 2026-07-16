import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class AngleDoubleLeftIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        AngleDoubleLeftIcon: DefineComponent<AngleDoubleLeftIcon>;
    }
}

export default AngleDoubleLeftIcon;
