import { Cleanup } from './subscription';

type Event<TPayload> = {
  subscribe: (fn: (v: TPayload) => void) => Cleanup;
};

export function on<TPayload>(event: Event<TPayload>): {
  event: Event<TPayload>;
};

export function on<TPayload, TValue>(
  event: Event<TPayload>,
  projectionFn: (payload: TPayload, previousValue: TValue) => TValue
): {
  event: Event<TPayload>;
  projectionFn: (payload: TPayload, previousValue: TValue) => TValue;
};

export function on<TPayload, TValue>(
  event: Event<TPayload>,
  projectionFn?: (payload: TPayload, previousValue: TValue) => TValue
) {
  return {
    event,
    projectionFn,
  };
}
