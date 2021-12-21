export interface TargetEvent<T extends EventTarget | null> extends Event {
    target: T,
}
