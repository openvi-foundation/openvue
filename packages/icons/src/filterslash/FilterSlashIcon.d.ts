import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class FilterSlashIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        FilterSlashIcon: DefineComponent<FilterSlashIcon>;
    }
}

export default FilterSlashIcon;
