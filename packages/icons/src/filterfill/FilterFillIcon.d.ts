import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class FilterFillIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        FilterFillIcon: DefineComponent<FilterFillIcon>;
    }
}

export default FilterFillIcon;
