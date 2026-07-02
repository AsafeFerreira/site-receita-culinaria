import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guardGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('auth_token');

  if(token) {
    return true;
  }
  
  return inject(Router).createUrlTree(['/login'])
};
