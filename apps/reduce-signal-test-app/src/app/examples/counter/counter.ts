import { Component } from '@angular/core';
import { event, on, reduceSignal } from 'reduce-signal';

@Component({
  standalone: true,
  selector: 'app-counter',
  template: `
    <button (click)="increment(1)">+</button>
    <span> Count: {{ count() }} </span>
    <button (click)="decrement(1)">-</button>
    <button (click)="reset()">Reset</button>
  `,
})
export class CounterComponent {
  increment = event<number>();
  decrement = event<number>();
  reset = event<void>();

  count = reduceSignal(
    0,
    on(this.increment, (payload, currentCount) => currentCount + payload),
    on(this.decrement, (payload, currentCount) => currentCount - payload),
    on(this.reset, () => 0)
  );
}
