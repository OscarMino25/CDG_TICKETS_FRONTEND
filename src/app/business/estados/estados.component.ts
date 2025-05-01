import { Component, inject } from '@angular/core';
import { EstadoService } from '../../core/services/estado.service'; // Asegúrate de que la ruta del servicio sea correcta
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-estados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estados.component.html',
  styleUrls: ['./estados.component.css']
})
export default class EstadosComponent {
  estadoService = inject(EstadoService);

  estados: any[] = [];
  estadoEdicion = {
    id: null,
    nombre: '',
    indicador: 'SI',
    created_at: '',
    updated_at: ''
  };
  editando = false;
  mostrarModal = false;


  constructor() {
    this.obtenerEstados();
  }

  obtenerEstados() {
    this.estadoService.obtenerEstados().subscribe((data) => {
      this.estados = data;
    });
  }

  abrirFormularioCreacion() {
    this.estadoEdicion = { id: null, nombre: '', indicador: 'SI', created_at: '', updated_at: '' };
    this.editando = false;
    this.mostrarModal = true;
  }

  abrirFormularioEdicion(estado: any) {
    this.estadoEdicion = {
      id: estado.id,
      nombre: estado.nombre,
      indicador: estado.indicador ? 'SI' : 'NO',
      created_at: estado.created_at,
      updated_at: estado.updated_at
    };
    this.editando = true;
    this.mostrarModal = true;
  }

  guardarEstado() {
    if (this.editando && this.estadoEdicion.id !== null) {
      this.estadoService
        .actualizarEstado(this.estadoEdicion.id, this.estadoEdicion)
        .subscribe(() => {
          this.obtenerEstados();
          this.cancelarFormulario();
        });
    } else {
      this.estadoService.crearEstado(this.estadoEdicion).subscribe(() => {
        this.obtenerEstados();
        this.estadoEdicion = { id: null, nombre: '', indicador: 'SI', created_at: '', updated_at: '' };
      });
    }
  }

  cancelarFormulario() {
    this.editando = false;
    this.mostrarModal = false;
    this.estadoEdicion = { id: null, nombre: '', indicador: 'SI', created_at: '', updated_at: '' };
  }

  eliminarEstado(id: number) {
    if (confirm('¿Estás seguro de eliminar este estado?')) {
      this.estadoService.eliminarEstado(id).subscribe(() => {
        this.obtenerEstados();
      });
    }
  }
}
