import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'policies', loadComponent: () => import('./policies/policies.component').then(m => m.PoliciesComponent) },
      { path: 'policies/:id/plans', loadComponent: () => import('./plans/plans.component').then(m => m.PlansComponent) },
      { path: 'enrollments', loadComponent: () => import('./enrollments/admin-enrollments.component').then(m => m.AdminEnrollmentsComponent) },
      { path: 'claims', loadComponent: () => import('./claims/admin-claims.component').then(m => m.AdminClaimsComponent) },
      { path: 'customers', loadComponent: () => import('./customers/admin-customers.component').then(m => m.AdminCustomersComponent) },
    ]
  }
];

