import { MetaType, toMeta } from '../index';

export const directives: MetaType[] = toMeta([
    { name: 'badge', as: 'BadgeDirective', from: 'openvue/badgedirective' },
    { name: 'tooltip', as: 'Tooltip', from: 'openvue/tooltip' },
    { name: 'ripple', as: 'Ripple', from: 'openvue/ripple' },
    { name: 'styleclass', as: 'StyleClass', from: 'openvue/styleclass' },
    { name: 'focustrap', as: 'FocusTrap', from: 'openvue/focustrap' },
    { name: 'animateonscroll', as: 'AnimateOnScroll', from: 'openvue/animateonscroll' },
    { name: 'keyfilter', as: 'KeyFilter', from: 'openvue/keyfilter' }
]);
