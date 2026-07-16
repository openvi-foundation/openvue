import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class CalendarIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        CalendarIcon: DefineComponent<CalendarIcon>;
    }
}

export default CalendarIcon;
