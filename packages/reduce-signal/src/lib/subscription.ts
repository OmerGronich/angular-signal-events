export type Cleanup = (() => void) | { unsubscribe: () => void }

export class Subscription {
  private cleanupFunctions = new Set<() => void>();

  add(_cleanup: Cleanup): void {
    const cleanup = () =>
      'unsubscribe' in _cleanup ? _cleanup.unsubscribe() : _cleanup();
    this.cleanupFunctions.add(cleanup);
  }

  unsubscribe(): void {
    for (const cleanup of this.cleanupFunctions) {
      cleanup();
    }
    this.cleanupFunctions.clear();
  }
}
