export * from '@openuxkit/utils';

export declare class ConnectedOverlayScrollHandler {
    constructor(element: any, listener?: () => void);
    bindScrollListener(): void;
    unbindScrollListener(): void;
    destroy(): void;
}

export declare class HelperSet {
    constructor(options: { init?: any; type?: string });
    add(instance: any): void;
    update(): void;
    delete(instance: any): void;
    clear(): void;
    get(parentInstance?: any, slots?: any): any[] | null | undefined;
}

export declare class SafeTriangle {
    constructor(delay?: number);
    bind(): void;
    unbind(): void;
    defer(event: MouseEvent, target: Element | null | undefined, callback: () => void): boolean;
    isPending(): boolean;
    cancel(): void;
}

/**
 * @deprecated since v4.3.0. Use `uuid` from @openuxkit/utils instead.
 * @param {string} prefix
 * @return {string}
 */
export declare function UniqueComponentId(prefix?: string): string;
