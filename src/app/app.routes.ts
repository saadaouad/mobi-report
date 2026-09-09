import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'reports',
    pathMatch: 'full',
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./features/reports/pages/report-list-page/report-list-page.component').then(
        (m) => m.ReportListPageComponent,
      ),
  },
  {
    path: 'reports/new',
    loadComponent: () =>
      import('./features/reports/pages/report-form-page/report-form-page.component').then(
        (m) => m.ReportFormPageComponent,
      ),
  },
  {
    path: 'reports/:id/edit',
    loadComponent: () =>
      import('./features/reports/pages/report-form-page/report-form-page.component').then(
        (m) => m.ReportFormPageComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'reports',
  },
];
