import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  selector: 'app-root',
  template: `
    <ul>
      <li>
        <a routerLink="counter"> Counter </a>
      </li>
      <li>
        <a routerLink="checkbox-tree"> Checkbox Tree </a>
      </li>
    </ul>
    <router-outlet />
  `,
})
export class AppComponent {}
