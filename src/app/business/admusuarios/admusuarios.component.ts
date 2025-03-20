import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { RoleService } from '../../core/services/role.service';
import { AlertService } from '../../core/services/alert.service';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '../../shared/components/alert/alert/alert.component';

@Component({
  selector: 'app-admusuarios',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule, AlertComponent],
  templateUrl: './admusuarios.component.html',
  styleUrls: ['./admusuarios.component.css']
})
export default class AdmusuariosComponent implements OnInit {
  users: any[] = [];
  rolesDisponibles: string[] = []; // Lista dinámica de roles desde el backend
  modalAbierto = false;
  modalConfirmacionEliminacionAbierto = false;
  esEdicion = false;
  userIdToDelete: number | null = null;
  searchQuery: string = '';

  // Ahora los roles son un array en lugar de un solo string
  nuevoUsuario = {
    id: null,
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '' // Usamos un solo rol, no un arreglo
  };

  dropdownOpen: boolean = false; // Estado del dropdown
  
  // Método para abrir o cerrar el dropdown
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Método para seleccionar una opción del dropdown
  selectOption(option: string) {
    this.nuevoUsuario.role = option;
    this.dropdownOpen = false; // Cerrar el dropdown después de seleccionar
  }

  constructor(
    private userService: UserService,
    private roleService: RoleService,  // Inyectamos el servicio de roles
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles(); // Cargar roles dinámicamente
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data: any[]) => {
        this.users = data.map((user: any) => ({
          ...user,
          roles: user.roles ? user.roles.map((r: any) => r.name) : []
        }));
      },
      error: (error) => {
        console.error('Error cargando usuarios', error);
        this.alertService.showAlert('Error al cargar los usuarios', 'error');
      }
    });
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.rolesDisponibles = roles.map((r: any) => r.name); // Extrae los nombres de roles
      },
      error: (error) => {
        console.error('Error cargando roles', error);
        this.alertService.showAlert('Error al cargar los roles', 'error');
      }
    });
  }

  buscarUsuarios(): void {
    if (this.searchQuery.length > 2) {
      this.userService.searchUsers(this.searchQuery).subscribe({
        next: (data) => {
          this.users = data;
        },
        error: (error) => {
          console.error('Error buscando usuarios', error);
          this.alertService.showAlert('Error al buscar usuarios', 'error');
        }
      });
    } else {
      this.loadUsers();
    }
  }

  abrirModal(): void {
    this.modalAbierto = true;
    this.esEdicion = false;
    this.resetFormulario();
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.resetFormulario();
  }

  resetFormulario(): void {
    this.nuevoUsuario = { id: null, name: '', email: '', password: '', password_confirmation: '', role: '' };
  }

  editarUsuario(user: any): void {
    this.nuevoUsuario = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: '',
      password_confirmation: '',
      role: user.roles.length > 0 ? user.roles[0] : '' // Selecciona el primer rol
    };
    this.esEdicion = true;
    this.modalAbierto = true;
  }
  crearUsuario(): void {
    if (this.esEdicion) {
      this.editarUsuarioBackend();
    } else {
      this.userService.createUser(this.nuevoUsuario).subscribe({
        next: () => {
          this.alertService.showAlert('Usuario creado correctamente', 'success');
          this.cerrarModal();
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error creando usuario', error);
          if (error.error && error.error.email) {
            this.alertService.showAlert(error.error.email[0], 'error');
          } else {
            this.alertService.showAlert('Hubo un error creando el usuario', 'error');
          }
        }
      });
    }
  }

  editarUsuarioBackend(): void {
    const userActualizado: any = { ...this.nuevoUsuario };
  
    if (!userActualizado.password) {
      delete userActualizado.password;
      delete userActualizado.password_confirmation;
    }
  
    // Solo se necesita enviar 'role' y no 'roles'
    delete userActualizado.roles; // Eliminar el campo roles si existe
  
    this.userService.updateUser(userActualizado).subscribe({
      next: () => {
        this.alertService.showAlert('Usuario actualizado correctamente', 'success');
        this.cerrarModal();
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error actualizando usuario', error);
        this.alertService.showAlert('Hubo un error actualizando el usuario', 'error');
      }
    });
  }

  deleteUser(id: number): void {
    this.userIdToDelete = id;
    this.modalConfirmacionEliminacionAbierto = true;
  }

  deleteConfirmed(): void {
    if (this.userIdToDelete) {
      this.userService.deleteUser(this.userIdToDelete).subscribe({
        next: () => {
          this.alertService.showAlert('Usuario eliminado correctamente', 'success');
          this.loadUsers();
          this.modalConfirmacionEliminacionAbierto = false;
        },
        error: (error) => {
          console.error('Error eliminando usuario', error);
          this.alertService.showAlert('Hubo un error al eliminar el usuario', 'error');
          this.modalConfirmacionEliminacionAbierto = false;
        }
      });
    }
  }

  
}
