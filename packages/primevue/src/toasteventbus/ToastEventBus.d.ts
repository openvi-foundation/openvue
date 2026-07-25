export interface ToastEventBus {
    on(type: string, callback: (...args: any[]) => void): this;
    off(type: string, callback?: (...args: any[]) => void): this;
    emit(type: string, ...args: any[]): this;
    clear(): void;
}

declare const eventBus: ToastEventBus;
export default eventBus;
