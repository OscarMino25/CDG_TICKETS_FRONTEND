import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { forkJoin } from 'rxjs';

// Interfaces para tipar correctamente los datos de la API
interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

interface UserRolesResponse {
  roles: Role[];
}

interface UserPermissionsResponse {
  permisos: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  userPermissions: string[] = [];
  userRole: string = ''; // Se asume que el usuario tiene solo un rol
  isSubmenuVisible = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUserData();
  }

  toggleSubmenu() {
    this.isSubmenuVisible = !this.isSubmenuVisible;
  }    

  loadUserData() {
    // Inicializamos las variables
    this.userRole = '';
    this.userPermissions = []; // Aseguramos que sea un arreglo vacío por defecto
  
    // Hacer ambas solicitudes al mismo tiempo
    forkJoin({
      roles: this.userService.getUserRoles(),  // API para obtener roles
      permisos: this.userService.getUserPermissions()  // API para obtener permisos
    }).subscribe({
      next: (response) => {
        console.log('Respuesta de roles:', response.roles);
        console.log('Respuesta de permisos:', response.permisos);
  
        // Manejar la respuesta de roles
        if (response.roles && response.roles.length > 0) {
          this.userRole = response.roles[0].name; // Asignamos el primer rol (si existe)
        } else {
          this.userRole = 'Sin rol';
        }
  
        // Asegurarnos de que los permisos sean un arreglo
        if (Array.isArray(response.permisos)) {
          this.userPermissions = response.permisos;
          console.log('Permisos actualizados:', this.userPermissions);
        } else if (response.permisos && Array.isArray(response.permisos.permisos)) {
          // Si la respuesta es un objeto con la propiedad 'permisos', acceder a ella
          this.userPermissions = response.permisos.permisos;
          console.log('Permisos actualizados desde objeto:', this.userPermissions);
        } else {
          console.error('Error: La respuesta de permisos no es un arreglo');
        }
      },
      error: (err) => {
        console.error('Error al cargar roles y permisos:', err);
      }
    });
  }

  // Método para verificar si el usuario tiene un permiso específico
  hasPermission(...permissions: string[]): boolean {
    console.log(this.userPermissions);  // Verifica que esta línea imprima correctamente los permisos
    return permissions.some(permission => this.userPermissions.includes(permission));
  }
}
