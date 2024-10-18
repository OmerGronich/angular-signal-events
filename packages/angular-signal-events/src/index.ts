import { Observable, Subject } from 'rxjs';
import {
  assertInInjectionContext,
  computed,
  DestroyRef,
  inject,
  Injector,
  signal,
  Signal,
} from '@angular/core';

export type Handler<E> = (<O>(
  transform: (e: E) => Promise<O> | O
) => Handler<O>) & {
  $: Observable<E>;
};

export type Emitter<E> = (e: E) => void;

export class HaltError extends Error {
  constructor(public reason?: string) {
    super(
      reason
        ? 'Event propagation halted: ' + reason
        : 'Event propagation halted'
    );
  }
}

export function halt(reason?: string): never {
  throw new HaltError(reason);
}

function makeHandler<E>($: Observable<E>, injector: Injector): Handler<E> {
  function handler<O>(transform: (e: E) => Promise<O> | O): Handler<O> {
    const next$ = new Subject<O>();
    const sub = $.subscribe((e) => {
      try {
        const res = transform(e);
        if (res instanceof Promise) res.then((o) => next$.next(o));
        else next$.next(res);
      } catch (e) {
        if (!(e instanceof HaltError)) throw e;
        console.info(e.message);
      }
    });
    injector.get(DestroyRef).onDestroy(() => sub.unsubscribe());
    return makeHandler<O>(next$, injector);
  }

  handler.$ = $;
  return handler;
}

export interface AngularEvent<E> {
  on: Handler<E>;
  emit: Emitter<E>;
}

export function event<E>(_injector?: Injector): AngularEvent<E> {
  _injector || assertInInjectionContext(event);
  const injector = _injector ?? inject(Injector);
  const $ = new Subject<E>();
  return {
    on: makeHandler($, injector),
    emit: (e) => $.next(e),
  } as const;
}

export function subject<T>(
  init: T,
  ...events: Array<Handler<T | ((prev: T) => T)>>
): Signal<T>;
export function subject<T>(
  init: () => T,
  ...events: Array<Handler<T | ((prev: T) => T)>>
): Signal<T>;
export function subject<T>(
  init: undefined,
  ...events: Array<Handler<T | ((prev: T) => T)>>
): Signal<T | undefined>;
export function subject<T>(
  init: T | undefined,
  ...events: Array<Handler<T | ((prev: T) => T)>>
): Signal<T | undefined>;
export function subject<T>(
  init: (() => T) | T | undefined,
  ...events: Array<Handler<T | ((prev: T) => T)>>
) {
  if (typeof init === 'function') {
    const comp = computed(() => subject((init as () => T)(), ...events));
    return () => comp()();
  } else {
    const sig = signal(init);
    events.forEach((h) =>
      h((v) => {
        if (typeof v === 'function') {
          sig.update(v as (value: T | undefined) => T | undefined);
        } else {
          sig.set(v as T);
        }
      })
    );
    return sig.asReadonly();
  }
}

export function partition<T>(
  handler: Handler<T>,
  predicate: (arg: T) => boolean
) {
  return {
    handleTrue: handler((p) => (predicate(p) ? p : halt())),
    handleFalse: handler((p) => (predicate(p) ? halt() : p)),
  };
}

export function topic<T>(...args: Handler<T>[]): Handler<T> {
  const { on, emit } = event<T>();
  args.forEach((h) => h(emit));
  return on;
}
