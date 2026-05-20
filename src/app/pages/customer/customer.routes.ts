import { Routes } from '@angular/router';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./customer-layout/customer-layout.component').then(m => m.CustomerLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent) },
      { path: 'policies', loadComponent: () => import('./policies/browse-policies.component').then(m => m.BrowsePoliciesComponent) },
      { path: 'policies/:id', loadComponent: () => import('./policies/policy-detail.component').then(m => m.PolicyDetailComponent) },
      { path: 'enroll/:planId', loadComponent: () => import('./enroll/enroll.component').then(m => m.EnrollComponent) },
      { path: 'enrollments', loadComponent: () => import('./enrollments/my-enrollments.component').then(m => m.MyEnrollmentsComponent) },
      { path: 'claims/new', loadComponent: () => import('./claims/submit-claim.component').then(m => m.SubmitClaimComponent) },
      { path: 'claims', loadComponent: () => import('./claims/my-claims.component').then(m => m.MyClaimsComponent) },
    ]
  }
];

