import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class InfoCircleIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        InfoCircleIcon: DefineComponent<InfoCircleIcon>;
    }
}

export default InfoCircleIcon;
