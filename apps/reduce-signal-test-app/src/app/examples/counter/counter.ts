import { Component } from '@angular/core';
import { event, reduceSignal, when } from 'reduce-signal';

@Component({
  standalone: true,
  selector: 'app-counter',
  template: `
    <button (click)="increment.emit(1)">+</button>
    <span> Count: {{ count() }} </span>
    <button (click)="decrement.emit(1)">-</button>
  `,
})
export class CounterComponent {
  increment = event<number>();
  decrement = event<number>();
  count = reduceSignal(
    0,
    when(this.increment, (payload, currentCount) => currentCount + payload),
    when(this.decrement, (payload, currentCount) => currentCount - payload),
  );
}
