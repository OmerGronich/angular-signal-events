export class Subscription {
  private cleanupFunctions = new Set<() => void>();

  add(cleanup: () => void): void {
    this.cleanupFunctions.add(cleanup);
  }

  remove(cleanup: () => void): void {
    this.cleanupFunctions.delete(cleanup);
  }

  unsubscribe(): void {
    for (const cleanup of this.cleanupFunctions) {
      cleanup();
    }
    this.cleanupFunctions.clear();
  }
}
