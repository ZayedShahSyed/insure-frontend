import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn()) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn() && authService.getRole() === 'ADMIN') {
    return true;
  }
  router.navigate(['/login']);
  return false;
};

export const customerGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn() && authService.getRole() === 'CUSTOMER') {
    return true;
  }
  router.navigate(['/login']);
  return false;
};

export const noAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.isLoggedIn()) {
    return true;
  }
  // Already logged in, redirect to appropriate dashboard
  if (authService.getRole() === 'ADMIN') {
    router.navigate(['/admin']);
  } else {
    router.navigate(['/customer']);
  }
  return false;
};
