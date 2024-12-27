import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'counter',
    loadComponent: () => import('./examples/counter'),
  },
  {
    path: 'tree-checkbox',
    loadComponent: () => import('./examples/tree-checkbox/tree-checkbox-page'),
  },
  {
    path: 'tabs',
    loadComponent: () => import('./examples/tabs')
  },
];
