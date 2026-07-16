import { MetaType, toMeta } from '../index';

export const composables: MetaType[] = toMeta([
    { name: 'usePrimeVue', as: 'usePrimeVue', from: 'openvue/config' },
    { name: 'useStyle', as: 'useStyle', from: 'openvue/usestyle' },
    { name: 'useConfirm', as: 'useConfirm', from: 'openvue/useconfirm' },
    { name: 'useToast', as: 'useToast', from: 'openvue/usetoast' },
    { name: 'useDialog', as: 'useDialog', from: 'openvue/usedialog' }
]);
