import type { when } from './when';
import {
  assertInInjectionContext,
  DestroyRef,
  inject,
  Injector,
  Signal,
  signal,
} from '@angular/core';
import { Subscription } from './subscription';

interface ReduceSignalConfig<T> {
  initialValue: T;
  injector?: Injector;
  equal?: (a: T, b: T) => boolean;
}

interface ParsedReduceSignalConfig<T> {
  initialValue: T;
  injector: Injector;
  equal?: (a: T, b: T) => boolean;
}

const defaultInjector = () => {
  assertInInjectionContext(reduceSignal);
  return inject(Injector);
};

function parseReduceSignalArgs<T>(
  initialStateOrConfig: T | ReduceSignalConfig<T>
): ParsedReduceSignalConfig<T> {
  if (
    initialStateOrConfig &&
    typeof initialStateOrConfig === 'object' &&
    'initialValue' in initialStateOrConfig
  ) {
    return {
      initialValue: initialStateOrConfig.initialValue,
      injector: initialStateOrConfig.injector ?? defaultInjector(),
      equal: initialStateOrConfig.equal,
    };
  }

  return {
    initialValue: initialStateOrConfig as T,
    injector: defaultInjector(),
  };
}

export function reduceSignal<T>(
  initialState: T,
  ...whens: ReturnType<typeof when<T>>[]
): Signal<T>;
export function reduceSignal<T>(
  config: ReduceSignalConfig<T>,
  ...whens: ReturnType<typeof when<T>>[]
): Signal<T>;
export function reduceSignal<T>(
  initialStateOrConfig: T | ReduceSignalConfig<T>,
  ...whens: ReturnType<typeof when<T>>[]
): Signal<T> {
  const { initialValue, injector, equal } =
    parseReduceSignalArgs(initialStateOrConfig);
  const destroyRef = injector.get(DestroyRef);
  const reduced = signal(initialValue, { equal });
  const subscription = new Subscription();
  whens.forEach((when) => {
    const { event, projectionFn } = when;
    subscription.add(
      event.subscribe((v) => {
        if (projectionFn) {
          reduced.set(projectionFn(v, reduced()));
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
}
