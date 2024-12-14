import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'counter',
    loadComponent: () => import('./examples/counter/counter').then(m => m.CounterComponent)
  },
  {
    path: 'checkbox-tree',
    loadComponent: () => import('./examples/checkbox-tree/checkbox-tree').then(m => m.CheckboxTreeComponent)
  }
];
