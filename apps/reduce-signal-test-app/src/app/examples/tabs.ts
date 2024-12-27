import { ChangeDetectionStrategy, Component, inject, Injectable } from '@angular/core';
import { event, on, reduceSignal } from 'reduce-signal';

const tabs = [
  ['Tab1', 'Tab2', 'Tab3'],
  ['FooTab', 'BarTab'],
  ['OrangeTab', 'AppleTab', 'BananaTab', 'GrapesTab'],
];

@Injectable({ providedIn: 'root' })
export class TabsService {
  getTabs(id: number) {
    return tabs[id];
  }
}

@Component({
  selector: 'app-root',
  imports: [],
  template: `
    <h1>Tabs</h1>
    @for (tab of tabs(); track tab) {
        @if (tab === selectedTab()) {
          <strong>{{ tab }}</strong>
        } @else {
          <button (click)="tabChanged($index)">{{ tab }}</button>
        }
    }
    <hr>
    selectedTab: {{ selectedTab() }}
    <br>
    <button (click)="listChanged()">switch list</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TabsComponent {
  // DI
  tabsService = inject(TabsService);

  // EVENTS
  listChanged = event<void>();
  tabChanged = event<number>();

  // STATE
  id = reduceSignal(
    2,
    on(this.listChanged, (_, i) => (i + 1) % 3)
  );
  tabs = reduceSignal(() => this.tabsService.getTabs(this.id()));
  selectedTab = reduceSignal(
    () => this.tabs()[0],
    on(this.tabChanged, (index) => this.tabs()[index])
  );
}

