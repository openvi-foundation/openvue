import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class UndoIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        UndoIcon: DefineComponent<UndoIcon>;
    }
}

export default UndoIcon;
