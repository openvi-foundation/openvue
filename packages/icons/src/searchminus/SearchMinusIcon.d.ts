import type { DefineComponent } from '@openvue/core';
import type { Icon } from '@openvue/icons/baseicon';

declare class SearchMinusIcon extends Icon {}

declare module 'vue' {
    export interface GlobalComponents {
        SearchMinusIcon: DefineComponent<SearchMinusIcon>;
    }
}

export default SearchMinusIcon;
