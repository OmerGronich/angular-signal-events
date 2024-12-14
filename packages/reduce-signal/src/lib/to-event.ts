import { Event } from './event';
import { assertInInjectionContext, DestroyRef, inject } from '@angular/core';
import { Subscribable } from './subscribable';

export function toEvent<T>(
  subscribable: Subscribable<T>,
  _destroyRef?: DestroyRef
): Event<T> {
  if (!_destroyRef) {
    assertInInjectionContext(toEvent);
  }
  const destroyRef = _destroyRef ?? inject(DestroyRef);
  const event = new Event<T>();
  const subscription = subscribable.subscribe((v) => {
    event.emit(v);
  });
  destroyRef.onDestroy(() => {
    subscription.unsubscribe();
  });
  return event;
}
