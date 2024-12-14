export interface Subscribable<T> {
  subscribe: (fn: (v: T) => void) => { unsubscribe: () => void };
}
