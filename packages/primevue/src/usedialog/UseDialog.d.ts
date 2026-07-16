import type { DynamicDialogInstance, DynamicDialogOptions } from 'openvue/dynamicdialogoptions';

export declare function useDialog(): {
    open: (content: any, options?: DynamicDialogOptions) => DynamicDialogInstance;
};
