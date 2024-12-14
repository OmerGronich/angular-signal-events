import { DestroyRef, Injector } from '@angular/core';
import { fakeAsync, TestBed } from '@angular/core/testing';

import { reduceSignal } from '../reduce-signal';
import { event } from '../event';
import { when } from '../when';

describe(reduceSignal.name, () => {
  it('should initialize with the provided initial state', () => {
    const result = TestBed.runInInjectionContext(() => reduceSignal(0));
    expect(result()).toBe(0);
  });

  it('should handle events and update state accordingly', fakeAsync(() => {
    const increment = event<number>();
    const result = TestBed.runInInjectionContext(() =>
      reduceSignal(0, when(increment))
    );

    increment.emit(5);
    expect(result()).toBe(5);

    increment.emit(10);
    expect(result()).toBe(10);
  }));

  it('should apply the projection function when provided', () => {
    const increment = event<number>();
    const result = TestBed.runInInjectionContext(() =>
      reduceSignal(
        0,
        when(increment, (payload, previous) => previous + payload)
      )
    );

    increment.emit(5);
    expect(result()).toBe(5);

    increment.emit(10);
    expect(result()).toBe(15);
  });

  it('should accept multiple `when` parameters', () => {
    const increment = event<number>();
    const decrement = event<number>();
    const reset = event<number>();
    const initialState = 0;
    const result = TestBed.runInInjectionContext(() =>
      reduceSignal(
        initialState,
        when(increment, (payload, previous) => previous + payload),
        when(decrement, (payload, previous) => previous - payload),
        when(reset)
      )
    );

    expect(result()).toBe(0);

    increment.emit(1);
    increment.emit(1);
    expect(result()).toBe(2);

    decrement.emit(1);
    expect(result()).toBe(1);

    reset.emit(0);
    expect(result()).toBe(0);
  });

  it('should respect the custom equality function', () => {
    const set = event<number>();
    const equal = (a: number, b: number) => Math.abs(a - b) < 5;
    const config = { initialValue: 0, equal };
    const result = TestBed.runInInjectionContext(() =>
      reduceSignal(config, when(set))
    );

    set.emit(3);
    expect(result()).toBe(0); // Because 3 is within 5 units of 0, state doesn't change

    set.emit(6);
    expect(result()).toBe(6); // Because 6 is more than 5 units away from 0
  });

  it('should initialize with ReduceSignalConfig', () => {
    const config = { initialValue: 10 };
    const result = TestBed.runInInjectionContext(() => reduceSignal(config));

    expect(result()).toBe(10);
  });

  it('should use custom injector if provided', () => {
    const customInjector = {
      get: jest.fn().mockReturnValue(TestBed.inject(DestroyRef)),
    } as unknown as Injector;

    const config = {
      initialValue: 0,
      injector: customInjector,
    };

    TestBed.runInInjectionContext(() => reduceSignal(config));

    expect(customInjector.get).toHaveBeenCalledWith(DestroyRef);
  });
});
