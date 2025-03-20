import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PermissionService } from '../services/permission.service';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const permissionsService = inject(PermissionService);

  if(authService.isAuthenticated()){
    return true;
  }else{
    return router.navigate(['/login']);
  }
};
