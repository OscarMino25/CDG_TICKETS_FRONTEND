import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthenticatedGuard } from './core/guards/authenticated.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./shared/components/layout/layout.component'),
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./business/dashboard/dashboard.component'),
                canActivate:[AuthGuard],
                data: { breadcrumb: 'Dashboard' }
            },
            {
                path: 'profile',
                loadComponent: () => import('./business/profile/profile.component'),
                canActivate:[AuthGuard],
                data: { breadcrumb: 'Perfil' }
            },
            {
                path: 'tables',
                loadComponent: () => import('./business/tables/tables.component'),
                canActivate:[AuthGuard],
                data: { breadcrumb: 'Tables' }
            },
            {
                path: 'admusuarios',
                loadComponent: () => import('./business/admusuarios/admusuarios.component'),
                canActivate:[AuthGuard],
                data: { breadcrumb: 'Administración / Administración de Usuarios' }
            },
            {
                path: 'admrolespermisos',
                loadComponent: () => import('./business/admrolespermisos/roles-permisos/roles-permisos.component'),
                canActivate:[AuthGuard],
                data: { breadcrumb: 'Administración / Administración de Roles y Permisos' }
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            

        ]
    },

    {
        path: 'login',
        loadComponent: ()=> import('./business/authentication/login/login.component'),
        canActivate: [AuthenticatedGuard]
    },

    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
