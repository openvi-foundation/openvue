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

export declare const OverlayRegistry: {
    /**
     * Registers an open overlay and the element of the component that owns it.
     */
    register(overlay: Element | null | undefined, owner: Node | null | undefined): void;
    /**
     * Unregisters an overlay when it starts to hide.
     */
    unregister(overlay: Element | null | undefined): void;
    /**
     * Whether the event happened inside the container, or inside an overlay owned by a component placed in it, at any depth.
     */
    isInside(event: Event | null | undefined, container: Element | null | undefined): boolean;
    /**
     * Whether an overlay owned by a component placed in the container is open.
     */
    hasNestedOverlay(container: Element | null | undefined): boolean;
};

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
