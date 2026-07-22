export interface BaseStyleRegistry {
    getLoadedStyleNames(): Set<string>;
    isStyleNameLoaded(name: string): boolean;
    setLoadedStyleName(name: string): void;
    deleteLoadedStyleName(name: string): void;
    clearLoadedStyleNames(): void;
}

declare const Base: BaseStyleRegistry;
export default Base;
