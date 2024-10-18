import {Component, computed, input} from '@angular/core';
import {event, partition, subject} from "angular-events";



@Component({
  standalone: true,
  imports: [],
  selector: 'counter',
  template: `
    <button (click)="increment.emit(1)">
      Count: {{ count() }}
    </button>
  `
})
export class Counter {
  countInput = input.required<number>({ alias: 'count' })
  increment = event<number>()
  count = subject(
    () => this.countInput,
    this.increment.on((delta) => (count) => count + delta))

}


@Component({
  standalone: true,
  imports: [],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  increment = event<number>()
  onMessage = this.increment.on((delta) => `Increment by ${delta}`);
  count = subject(0, this.increment.on((delta) => (count) => count + delta))
  incrementValidation = partition(
    this.increment.on,
    delta => delta > 0
  )

  constructor() {
    this.incrementValidation.handleTrue(delta => console.log(`Valid increment by ${delta}`))
    this.incrementValidation.handleFalse(() => console.log(`Please use a number greater than 0`))
  }
}
