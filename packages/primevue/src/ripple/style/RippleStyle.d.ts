/**
 *
 * Ripple directive adds ripple effect to the host element.
 *
 * [Live Demo](https://openvue.dev/ripple)
 *
 * @module ripplestyle
 *
 */
import type { BaseStyle } from '@openvue/core/base/style';

export enum RippleClasses {
    /**
     * Class name of the root element
     */
    root = 'p-ink'
}

export interface RippleStyle extends BaseStyle {}
