import { fakeAsync, TestBed } from '@angular/core/testing';

import { reduceSignal } from '../reduce-signal';
import { event } from '../event';
import { on } from '../on';

describe(reduceSignal.name, () => {
  it('should initialize with the provided initial state', () => {
    const result = TestBed.runInInjectionContext(() => reduceSignal(0));
    expect(result()).toBe(0);
  });

  it('should handle events and update state accordingly', fakeAsync(() => {
    const increment = event<number>();
    const result = TestBed.runInInjectionContext(() =>
      reduceSignal(0, on(increment))
    );

    increment(5);
    expect(result()).toBe(5);

    increment(10);
    expect(result()).toBe(10);
  }));

  it('should apply the projection function when provided', () => {
    const increment = event<number>();
    const result = TestBed.runInInjectionContext(() =>
      reduceSignal(
        0,
        on(increment, (payload, previous) => previous + payload)
      )
    );

    increment(5);
    expect(result()).toBe(5);

    increment(10);
    expect(result()).toBe(15);
  });

  it('should accept multiple `on` parameters', () => {
    const increment = event<number>();
    const decrement = event<number>();
    const reset = event<void>();
    const initialState = 0;
    const result = TestBed.runInInjectionContext(() =>
      reduceSignal(
        initialState,
        on(increment, (payload, previous) => previous + payload),
        on(decrement, (payload, previous) => previous - payload),
        on(reset, () => initialState)
      )
    );

    expect(result()).toBe(0);

    increment(1);
    increment(1);
    expect(result()).toBe(2);

    decrement(1);
    expect(result()).toBe(1);

    reset();
    expect(result()).toBe(0);
  });
});
