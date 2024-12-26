import type { on } from './on';
import {
  assertInInjectionContext,
  DestroyRef,
  inject,
  Injector,
  linkedSignal,
  runInInjectionContext,
  Signal,
} from '@angular/core';
import { Subscription } from './subscription';

type Event<TPayload, TValue = undefined> = TValue extends undefined
  ? ReturnType<typeof on<TPayload>>
  : ReturnType<typeof on<TPayload, TValue>>;

export function reduceSignal<T, TPayload1>(
  initialState: T | (() => T),
  event1: Event<TPayload1, T> | Event<T>
): Signal<T>;

export function reduceSignal<T, TPayload1, TPayload2>(
  initialState: T | (() => T),
  event1: Event<TPayload1, T> | Event<T>,
  event2: Event<TPayload2, T> | Event<T>
): Signal<T>;

export function reduceSignal<T, TPayload1, TPayload2, TPayload3>(
  initialState: T | (() => T),
  event1: Event<TPayload1, T> | Event<T>,
  event2: Event<TPayload2, T> | Event<T>,
  event3: Event<TPayload3, T> | Event<T>
): Signal<T>;

export function reduceSignal<T, TPayload1, TPayload2, TPayload3, TPayload4>(
  initialState: T | (() => T),
  event1: Event<TPayload1, T> | Event<T>,
  event2: Event<TPayload2, T> | Event<T>,
  event3: Event<TPayload3, T> | Event<T>,
  event4: Event<TPayload4, T> | Event<T>
): Signal<T>;

export function reduceSignal<
  T,
  TPayload1,
  TPayload2,
  TPayload3,
  TPayload4,
  TPayload5
>(
  initialState: T | (() => T),
  event1: Event<TPayload1, T> | Event<T>,
  event2: Event<TPayload2, T> | Event<T>,
  event3: Event<TPayload3, T> | Event<T>,
  event4: Event<TPayload4, T> | Event<T>,
  event5: Event<TPayload5, T> | Event<T>
): Signal<T>;

export function reduceSignal<
  T,
  TPayload1,
  TPayload2,
  TPayload3,
  TPayload4,
  TPayload5,
  TPayload6
>(
  initialState: T | (() => T),
  event1: Event<TPayload1, T> | Event<T>,
  event2: Event<TPayload2, T> | Event<T>,
  event3: Event<TPayload3, T> | Event<T>,
  event4: Event<TPayload4, T> | Event<T>,
  event5: Event<TPayload5, T> | Event<T>,
  event6: Event<TPayload6, T> | Event<T>
): Signal<T>;

export function reduceSignal<
  T,
  TPayload1,
  TPayload2,
  TPayload3,
  TPayload4,
  TPayload5,
  TPayload6,
  TPayload7
>(
  initialState: T | (() => T),
  event1: Event<TPayload1, T> | Event<T>,
  event2: Event<TPayload2, T> | Event<T>,
  event3: Event<TPayload3, T> | Event<T>,
  event4: Event<TPayload4, T> | Event<T>,
  event5: Event<TPayload5, T> | Event<T>,
  event6: Event<TPayload6, T> | Event<T>,
  event7: Event<TPayload7, T> | Event<T>
): Signal<T>;

export function reduceSignal<
  T,
  TPayload1,
  TPayload2,
  TPayload3,
  TPayload4,
  TPayload5,
  TPayload6,
  TPayload7,
  TPayload8
>(
  initialState: T | (() => T),
  event1: Event<TPayload1, T> | Event<T>,
  event2: Event<TPayload2, T> | Event<T>,
  event3: Event<TPayload3, T> | Event<T>,
  event4: Event<TPayload4, T> | Event<T>,
  event5: Event<TPayload5, T> | Event<T>,
  event6: Event<TPayload6, T> | Event<T>,
  event7: Event<TPayload7, T> | Event<T>,
  event8: Event<TPayload8, T> | Event<T>
): Signal<T>;

export function reduceSignal<
  T,
  TPayload1,
  TPayload2,
  TPayload3,
  TPayload4,
  TPayload5,
  TPayload6,
  TPayload7,
  TPayload8,
  TPayload9
>(
  initialState: T | (() => T),
  event1: Event<TPayload1, T> | Event<T>,
  event2: Event<TPayload2, T> | Event<T>,
  event3: Event<TPayload3, T> | Event<T>,
  event4: Event<TPayload4, T> | Event<T>,
  event5: Event<TPayload5, T> | Event<T>,
  event6: Event<TPayload6, T> | Event<T>,
  event7: Event<TPayload7, T> | Event<T>,
  event8: Event<TPayload8, T> | Event<T>,
  event9: Event<TPayload9, T> | Event<T>
): Signal<T>;

export function reduceSignal<
  T,
  TPayload1,
  TPayload2,
  TPayload3,
  TPayload4,
  TPayload5,
  TPayload6,
  TPayload7,
  TPayload8,
  TPayload9,
  TPayload10
>(
  initialState: T | (() => T),
  event1: Event<TPayload1, T> | Event<T>,
  event2: Event<TPayload2, T> | Event<T>,
  event3: Event<TPayload3, T> | Event<T>,
  event4: Event<TPayload4, T> | Event<T>,
  event5: Event<TPayload5, T> | Event<T>,
  event6: Event<TPayload6, T> | Event<T>,
  event7: Event<TPayload7, T> | Event<T>,
  event8: Event<TPayload8, T> | Event<T>,
  event9: Event<TPayload9, T> | Event<T>,
  event10: Event<TPayload10, T> | Event<T>
): Signal<T>;

export function reduceSignal<T>(
  initialState: T | (() => T),
  ...events: Array<Event<any, T>>
): Signal<T> {
  assertInInjectionContext(reduceSignal);
  const assertedInjector = inject(Injector);

  return runInInjectionContext(assertedInjector, () => {
    const destroyRef = inject(DestroyRef);
    const reduced = linkedSignal(() =>
      typeof initialState === 'function'
        ? (initialState as () => T)()
        : initialState
    );
    const subscription = new Subscription();
    events.forEach((eventConfig) => {
      subscription.add(
        eventConfig.event.subscribe((v) => {
          if ('projectionFn' in eventConfig) {
            reduced.set(eventConfig.projectionFn(v, reduced()));
          } else {
            reduced.set(v);
          }
        })
      );
    });
    destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
    return reduced.asReadonly();
  });
}
