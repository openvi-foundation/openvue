import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class TimesIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        TimesIcon: DefineComponent<TimesIcon>;
    }
}

export default TimesIcon;
