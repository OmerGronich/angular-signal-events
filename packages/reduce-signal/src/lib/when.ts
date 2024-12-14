import { Subscribable } from './subscribable';

export function when<T>(
  event: Subscribable<T>,
  projectionFn?: (payload: T, previousValue: T) => T
) {
  return {
    event,
    projectionFn,
  };
}
