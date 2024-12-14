export type Cleanup = (() => void) | { unsubscribe: () => void }

export type Subscribable<T> = {
  subscribe: (fn: (v: T) => void) => Cleanup;
};
