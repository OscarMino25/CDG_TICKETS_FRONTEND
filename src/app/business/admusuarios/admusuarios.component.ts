import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admusuarios',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './admusuarios.component.html',
  styleUrls: ['./admusuarios.component.css']
})
export default class AdmusuariosComponent implements OnInit {
  users: any[] = [];
  modalAbierto = false; // Estado del modal
  esEdicion = false; // Controla si estamos en modo de edición
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

  constructor(private userService: UserService) { }

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
      // Si no estamos en modo edición, es creación
      this.userService.createUser(this.nuevoUsuario).subscribe({
        next: () => {
          alert('Usuario creado correctamente');
          this.cerrarModal();
          this.loadUsers(); // Recargar usuarios después de crear uno nuevo
        },
        error: (error) => {
          console.error('Error creando usuario', error);
        }
      });
    }
  }

  editarUsuarioBackend(): void {
    this.userService.updateUser(this.nuevoUsuario).subscribe({
      next: () => {
        alert('Usuario actualizado correctamente');
        this.cerrarModal();
        this.loadUsers(); // Recargar usuarios después de actualizar uno
      },
      error: (error) => {
        console.error('Error actualizando usuario', error);
      }
    });
  }

  deleteUser(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          alert('Usuario eliminado correctamente');
          this.loadUsers(); // Recargar usuarios después de eliminar uno
        },
        error: (error) => {
          console.error('Error eliminando usuario', error);
          alert('Hubo un error al eliminar el usuario');
        }
      });
    }
  }
}
