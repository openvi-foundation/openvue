import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class ChevronUpIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        ChevronUpIcon: DefineComponent<ChevronUpIcon>;
    }
}

export default ChevronUpIcon;
