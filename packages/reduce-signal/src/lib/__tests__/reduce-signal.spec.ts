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

  it('should handle computation as initial state', () => {
    const increment = event<number>();
    const decrement = event<number>();
    const reset = event<void>();
    const count = TestBed.runInInjectionContext(() =>
      reduceSignal(
        0,
        on(increment, (payload, previous) => previous + payload),
        on(decrement, (payload, previous) => previous - payload),
        on(reset, () => 0)
      )
    );
    const doubleCount = TestBed.runInInjectionContext(() =>
      reduceSignal(() => count() * 2)
    );

    expect(doubleCount()).toBe(0);

    increment(1);
    increment(1);
    expect(doubleCount()).toBe(4);

    decrement(1);
    expect(doubleCount()).toBe(2);

    reset();
    expect(doubleCount()).toBe(0);
  });

  it('should handle computation that also receives multiple `on` parameters', () => {
    const TABS = [
      ['Tab1', 'Tab2', 'Tab3'],
      ['FooTab', 'BarTab'],
      ['OrangeTab', 'AppleTab', 'BananaTab', 'GrapesTab'],
    ];
    const listChanged = event<void>();
    const tabChanged = event<number>();

    const id = TestBed.runInInjectionContext(() =>
      reduceSignal(
        2,
        on(listChanged, (_, i) => (i + 1) % 3)
      )
    );
    const tabs = TestBed.runInInjectionContext(() => reduceSignal(() => TABS[id()]));
    const selectedTab = TestBed.runInInjectionContext(() =>
      reduceSignal(
        () => tabs()[0],
        on(tabChanged, (index) => tabs()[index])
      )
    );

    expect(id()).toBe(2);
    expect(tabs()).toEqual(TABS[2]);
    expect(selectedTab()).toBe('OrangeTab');

    listChanged();
    expect(id()).toBe(0);
    expect(tabs()).toEqual(TABS[0]);
    expect(selectedTab()).toBe('Tab1');

    tabChanged(1);
    expect(selectedTab()).toBe('Tab2');

    listChanged();
    expect(id()).toBe(1);
    expect(tabs()).toEqual(TABS[1]);
    expect(selectedTab()).toBe('FooTab');
  });
});
