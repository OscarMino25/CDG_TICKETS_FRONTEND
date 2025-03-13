import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../core/services/user.service';
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
  modalAbierto = false; // Estado del modal
  modalConfirmacionEliminacionAbierto = false; // Estado del modal de confirmación de eliminación
  esEdicion = false; // Controla si estamos en modo de edición
  userIdToDelete: number | null = null; // Guardar el ID del usuario a eliminar
  searchQuery: string = '';  // Variable para almacenar el término de búsqueda

  // Este objeto será reutilizado para la creación y edición de usuarios
  nuevoUsuario = {
    id: null,
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user'
  };

  constructor(private userService: UserService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Error cargando usuarios', error);
        this.alertService.showAlert('Error al cargar los usuarios', 'error');
      }
    });
  }

  buscarUsuarios(): void {
    if (this.searchQuery.length > 2) {  // Solo busca si la longitud es mayor a 2
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
      this.loadUsers(); // Si no hay búsqueda, recarga todos los usuarios
    }
  }

  abrirModal(): void {
    this.modalAbierto = true;
    this.esEdicion = false; // Por defecto, es creación
    this.resetFormulario();
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.resetFormulario(); // Resetear formulario al cerrar modal
  }

  // Resetear el formulario a su estado inicial
  resetFormulario(): void {
    this.nuevoUsuario = { id: null, name: '', email: '', password: '', password_confirmation: '', role: 'user' };
  }

  // Esta función se llama cuando el usuario quiere editar
  editarUsuario(user: any): void {
    this.nuevoUsuario = { ...user };  // Rellenamos los campos del formulario con los datos del usuario
    this.esEdicion = true;  // Establecer que estamos en modo edición
    this.modalAbierto = true;  // Abrimos el modal
  }

  crearUsuario(): void {
    if (this.esEdicion) {
      // Si estamos en modo edición, llamamos a la función para editar
      this.editarUsuarioBackend();
    } else {
      this.userService.createUser(this.nuevoUsuario).subscribe({
        next: () => {
          this.alertService.showAlert('Usuario creado correctamente', 'success');
          this.cerrarModal();
          this.loadUsers(); // Recargar usuarios después de crear uno nuevo
        },
        error: (error) => {
          console.error('Error creando usuario', error);
          
          // Verificamos si hay errores específicos (como validaciones)
          if (error.error && error.error.email) {
            // Si el backend envía un error en el campo email
            this.alertService.showAlert(error.error.email[0], 'error');
          } else {
            // Si no, mostramos un mensaje genérico
            this.alertService.showAlert('Hubo un error creando el usuario', 'error');
          }
        }
      });
    }
  }

  editarUsuarioBackend(): void {
    this.userService.updateUser(this.nuevoUsuario).subscribe({
      next: () => {
        this.alertService.showAlert('Usuario actualizado correctamente', 'success');
        this.cerrarModal();
        this.loadUsers(); // Recargar usuarios después de actualizar uno
      },
      error: (error) => {
        console.error('Error actualizando usuario', error);
        this.alertService.showAlert('Hubo un error actualizando el usuario', 'error');
      }
    });
  }

  // Método para eliminar usuario - muestra el modal de confirmación
  deleteUser(id: number): void {
    this.userIdToDelete = id; // Guardar el ID del usuario a eliminar
    this.modalConfirmacionEliminacionAbierto = true; // Mostrar el modal de confirmación
  }

  // Método que se ejecuta cuando el usuario confirma la eliminación
  deleteConfirmed(): void {
    if (this.userIdToDelete) {
      this.userService.deleteUser(this.userIdToDelete).subscribe({
        next: () => {
          this.alertService.showAlert('Usuario eliminado correctamente', 'success');
          this.loadUsers(); // Recargar usuarios después de eliminar uno
          this.modalConfirmacionEliminacionAbierto = false; // Cerrar el modal
        },
        error: (error) => {
          console.error('Error eliminando usuario', error);
          this.alertService.showAlert('Hubo un error al eliminar el usuario', 'error');
          this.modalConfirmacionEliminacionAbierto = false; // Cerrar el modal
        }
      });
    }
  }
}
