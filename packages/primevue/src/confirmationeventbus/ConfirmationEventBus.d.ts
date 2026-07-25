export interface ConfirmationEventBus {
    on(type: string, callback: (...args: any[]) => void): this;
    off(type: string, callback?: (...args: any[]) => void): this;
    emit(type: string, ...args: any[]): this;
    clear(): void;
}

declare const eventBus: ConfirmationEventBus;
export default eventBus;
