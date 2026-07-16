import type { ConfirmationOptions } from 'openvue/confirmationoptions';

export declare function useConfirm(): {
    require: (option: ConfirmationOptions) => void;
    close: () => void;
};
