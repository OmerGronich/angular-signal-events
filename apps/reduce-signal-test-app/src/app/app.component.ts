import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink],
  selector: 'app-root',
  template: `
    <ul>
      <li>
        <a routerLink="counter"> Counter </a>
      </li>
      <li>
        <a routerLink="tabs"> Tabs </a>
      </li>
      <li>
        <a routerLink="tree-checkbox">
          Tree Checkbox
        </a>
      </li>
    </ul>
    <router-outlet />
  `,
})
export class AppComponent {
}
