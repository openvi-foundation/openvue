import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class SearchIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        SearchIcon: DefineComponent<SearchIcon>;
    }
}

export default SearchIcon;
