import {Component} from '@angular/core';
import {event, subject} from "angular-events";

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

  constructor() {
    this.onMessage(message => console.log(`Message emitted:`, message))
  }
}
