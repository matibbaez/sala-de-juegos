import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

export const publicGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const sesion = await authService.obtenerSesion();

  if (sesion) {
    router.navigate(['/home']);
    return false; 
  }
  
  return true; 
};

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const sesion = await authService.obtenerSesion();

  if (!sesion) {
    router.navigate(['/login']);
    return false; 
  }
  
  return true; 
};