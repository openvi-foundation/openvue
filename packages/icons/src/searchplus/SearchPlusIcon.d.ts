import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class SearchPlusIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        SearchPlusIcon: DefineComponent<SearchPlusIcon>;
    }
}

export default SearchPlusIcon;
