import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'listbox',
    loadComponent: () => import('./listbox/listbox-demo'),
  },
  {
    path: 'grid',
    loadComponent: () => import('./grid/grid-demo'),
  },
  {
    path: '**',
    redirectTo: 'listbox',
  },
];
