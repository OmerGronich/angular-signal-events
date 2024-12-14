import { Event } from './event';

export function when<T>(
  event: Event<T>,
  projectionFn?: (payload: T, previousValue: T) => T
) {
  return {
    event,
    projectionFn,
  };
}
