import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class UploadIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        UploadIcon: DefineComponent<UploadIcon>;
    }
}

export default UploadIcon;
