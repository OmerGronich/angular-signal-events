# angular-signal-events

This is a port of https://github.com/devagrawal09/solid-events to Angular.

## Installation

```shell
npm install angular-signal-events
```

## Event

Returns an event handler and an event emitter. The handler can execute a callback when the event is emitted.

```typescript
import {event} from 'angular-signal-events'

@Component()
export class Counter {
  greeting = event<string>()

  constructor() {
    this.greeting.on(greeting => console.log(`Event emitted:`, greeting))
    
    this.greeting.emit("Hello World!")
    // logs "Event emitted: Hello World!"
  }
}
```

## Transformation
The handler can return a new handler with the value returned from the callback. This allows chaining transformations.

```typescript
import {event, halt} from 'angular-signal-events'

@Component()
export class Counter {
  increment = event<string>()

  constructor() {
    const onMessage = this.increment.on((delta) => `Increment by ${delta}`)
    onMessage(message => console.log(`Message emitted:`, message))
    this.increment.emit(2)
    // logs "Message emitted: Increment by 2"
  }
}
```

## Disposal
Handlers that are called inside a component are automatically cleaned up with the component, so no manual bookkeeping is necessary.

## Halting
Event propagation can be stopped at any point using halt()

```typescript
import {event} from 'angular-signal-events'

@Component()
export class Counter {
  increment = event<string>()

  constructor() {
    const onValidIncrement = this.increment.on(delta => delta < 1 ? halt() : delta)
    const onMessage = this.increment.on((delta) => `Increment by ${delta}`)

    onMessage(message => console.log(`Message emitted:`, message))

    this.increment.emit(2)
    // logs "Message emitted: Increment by 2"

    this.increment.emit(0)
    // Doesn't log anything
  }
}
```
halt() returns a never, so typescript correctly infers the return type of the handler.

## Async Events

If you return a promise from an event callback, the resulting event will wait to emit until the promise resolves. In other words, promises are automatically flattened by events.

```typescript
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {event} from 'angular-signal-events'
import {firstValueFrom} from "rxjs";

@Component()
export class BoardEditorComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  createBoard = event<BoardData>();

  constructor() {
    const onBoardCreated = this.createBoard.on((boardData) => createBoard(boardData));
    onBoardCreated(boardId => this.router.navigate(['board', boardId]))
  }

  createBoard(boardData: BoardData) {
    return firstValueFrom(this.http.post<string>('...'));
  }
}
```

## Subject

Events can be used to derive state using Subjects. A Subject is a signal that can be derived from event handlers.

```typescript
import {event, subject} from 'angular-signal-events'

@Component({
  template: `
    <div>Count: {{count()}}</div>
    <button (click)="increment.emit(1)">+</button>
    <button (click)="reset.emit()">reset</button>
  `
})
export class Counter {
  increment = event<string>()
  reset = event<void>()
  
  count = subject(
    0,
    this.increment.on(delta => currentCount => currentCount + delta),
    this.reset.on(() => 0)
  )
}
```

To update the value of a subject, event handlers can return a value (like `reset.on`), or a function that transforms the current value (like `increment.on`).

## Async Subject

TBD. Angular doesn't have an async reactive primitive. ([yet](https://github.com/angular/angular/pull/58255/files))

## Topic

A topic combines multiple events into one. This is simply a more convenient way to merge events than manually iterating through them.

```typescript
@Component()
export class Counter {
  increment = event<number>()
  decrement = event<number>()

  onMessage = topic(
    this.increment.on((delta) => `Increment by ${delta}`),
    this.decrement.on((delta) => `Decrement by ${delta}`)
  );

  constructor() {
    this.onMessage(message => console.log(`Message emitted:`, message))

    this.increment.emit(2)
    // logs "Message emitted: Increment by 2"
    this.decrement.emit(1)
    // logs "Message emitted: Decrement by 1"
  }
}
```

## Partition

A partition splits an event based on a conditional. This is simply a more convenient way to conditionally split events than using halt().

```typescript
@Component()
export class Counter {
  increment = event<number>()
  incrementValidation = partition(
    this.increment.on,
    delta => delta > 0
  )
  
  constructor() {
    this.incrementValidation.handleTrue(delta => console.log(`Valid increment by ${delta}`))
    this.incrementValidation.handleFalse(() => console.log(`Please use a number greater than 0`))    
  }
}
```


## Important Note

This library is primarily intended for experimental purposes, exploring potential smoother interactions between signals and events. For production use, RxJS is recommended as the preferred choice.
