import { Component } from '@angular/core';
import { RoleService } from '../../../core/services/role.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PermissionService } from '../../../core/services/permission.service';
import { AlertComponent } from '../../../shared/components/alert/alert/alert.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


// Definir interfaces para Rol y Permiso
interface Permiso {
  id: number;
  name: string;
  selected: boolean; // Para el checkbox
}

interface Rol {
  id: string;
  name: string;
  permisos: Permiso[]; // Lista de permisos asociados al rol
}

@Component({
  selector: 'app-roles-permissions',
  standalone: true,
  templateUrl: './roles-permisos.component.html',
  styleUrls: ['./roles-permisos.component.css'],
  providers: [RoleService, PermissionService],  // Aquí agregamos los servicios en providers
  imports: [AlertComponent, CommonModule, FormsModule,RouterLink, RouterLinkActive],
})
export default class RolesPermissionsComponent {
  roles: Rol[] = []; // Arreglo de roles con la estructura definida
  permisosDisponibles: Permiso[] = []; // Arreglo de permisos disponibles
  selectedPermissions: any[] = []; // Permisos seleccionados
  newRoleName: string = '';
  modalAbierto: boolean = false; // Para controlar el estado del modal
  esEdicion: boolean = false; // Para saber si es edición o creación de rol
  nuevoRol: Rol = { id: '', name: '', permisos: [] }; // Para guardar los datos del rol

  constructor(private roleService: RoleService, private permissionService: PermissionService) {}

  ngOnInit() {
    this.loadRoles();
    this.loadPermissions();
  }

  loadRoles() {
    this.roleService.getRoles().subscribe((roles: Rol[]) => {
      this.roles = roles;
  
      // Ahora, para cada rol, obtenemos sus permisos
      this.roles.forEach(rol => {
        this.roleService.getPermissionsForRole(rol.id).subscribe((permisosAsignados: any[]) => {
          // Aquí asignamos 'selected: false' a cada permiso
          rol.permisos = permisosAsignados.map(p => ({
            id: p.id,   // Suponiendo que la respuesta tiene un 'id' para cada permiso
            name: p.name, // Y un 'name' para cada permiso
            selected: false  // Agregamos la propiedad 'selected' para cumplir con la interfaz 'Permiso'
          }));
          console.log(`Permisos para el rol ${rol.name}:`, rol.permisos);
        });
      });
    });
  }

  loadPermissions() {
    this.permissionService.getPermissions().subscribe((permissions: any[]) => {
      // Asegúrate de que cada permiso tenga la estructura correcta con 'id', 'name', y 'selected'
      this.permisosDisponibles = permissions.map(permiso => ({
        id: permiso.id, // Asignamos el id del permiso
        name: permiso.name,
        selected: false, // Inicialmente no seleccionado
      }));
    });
  }

  crearOeditarRol() {
    if (this.esEdicion) {
      // Llamar a la API para editar el rol
      this.roleService.updateRole(this.nuevoRol.id, this.nuevoRol).subscribe(() => {
        this.loadRoles();
        this.cerrarModal();
      });
    } else {
      // Llamar a la API para crear un rol
      const permisosSeleccionados = this.permisosDisponibles.filter(p => p.selected).map(p => p.name);
      this.roleService.createRole({ name: this.nuevoRol.name, permissions: permisosSeleccionados }).subscribe(() => {
        this.loadRoles();
        this.cerrarModal();
      });
    }
  }

  abrirModal(rol: Rol | null = null) {
    this.modalAbierto = true;
  
    if (rol) {
      this.esEdicion = true;
      this.nuevoRol = { ...rol };
  
      // Reiniciar los permisos disponibles antes de asignarlos nuevamente
      this.permisosDisponibles = this.permisosDisponibles.map(permiso => ({
        ...permiso,
        selected: false
      }));
  
      console.log(`▶️ Cargando permisos para el rol: ${rol.name} (ID: ${rol.id})`);
  
      // Obtener los permisos asignados al rol desde la API
      this.roleService.getPermissionsForRole(rol.id).subscribe((permisosAsignados: any[]) => {
        console.log('🔹 Permisos asignados desde la API:', permisosAsignados);
  
        // Extraer los IDs de los permisos asignados desde la propiedad pivot
        const permisosAsignadosIds = permisosAsignados.map(p => p.pivot.permission_id);
        console.log('✅ IDs de permisos asignados:', permisosAsignadosIds);
  
        // Marcar como seleccionados solo los permisos asignados
        this.permisosDisponibles = this.permisosDisponibles.map(permiso => {
          const seleccionado = permisosAsignadosIds.includes(permiso.id);
          console.log(`🔍 Permiso: ${permiso.name} (ID: ${permiso.id}) - Seleccionado: ${seleccionado}`);
          return {
            ...permiso,
            selected: seleccionado
          };
        });
  
        console.log('🎯 Permisos después de asignar:', this.permisosDisponibles);
      });
  
    } else {
      this.esEdicion = false;
      this.nuevoRol = { id: '', name: '', permisos: [] };
  
      // Asegurar que ningún permiso quede seleccionado en modo creación
      this.permisosDisponibles = this.permisosDisponibles.map(permiso => ({
        ...permiso,
        selected: false
      }));
    }
  }


  cerrarModal() {
    this.modalAbierto = false;
    this.esEdicion = false;
    this.nuevoRol = { id: '', name: '', permisos: [] };
  }

  deleteRole(roleId: string) {
    this.roleService.deleteRole(roleId).subscribe(() => {
      this.loadRoles(); // Recargar roles
    });
  }
}
