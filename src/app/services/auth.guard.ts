import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './firebase-auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = await authService.checkAuthLoggedInAsUser();

  if (isAuthenticated) {
    return true;
  } else {
    // console.error('Der Benutzer hat keinen Zugriff auf diese Route');
    router.navigate(['/sign-in']);
    return false;
  }
};
