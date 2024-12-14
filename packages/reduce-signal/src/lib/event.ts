type Observer<T> = (value: T) => void;

export class Event<T> {
  private observers = new Set<Observer<T>>();

  subscribe(observer: Observer<T>): () => void {
    this.observers.add(observer);

    return () => this.observers.delete(observer);
  }

  emit(value: T): void {
    for (const observer of this.observers) {
      observer(value);
    }
  }
}

export function event<T>() {
  return new Event<T>();
}
