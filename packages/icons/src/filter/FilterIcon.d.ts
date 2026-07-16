import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class FilterIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        FilterIcon: DefineComponent<FilterIcon>;
    }
}

export default FilterIcon;
