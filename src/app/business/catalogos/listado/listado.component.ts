import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { TipificacionService } from '../../../core/services/tipificacion.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, HttpClientModule,FormsModule],
  templateUrl: './listado.component.html',
})
export default class CatalogoComponent implements OnInit {
  tipificaciones: any[] = [];
  nuevoCatalogo: any = {};
  mostrarModalCreacion: boolean = false;
  catalogos: any[] = [];
  catalogoEdicion: any = {};  // Para almacenar el catálogo que se va a editar
  mostrarModal: boolean = false;

  constructor(private catalogoService: CatalogoService,
    private tipificacionService: TipificacionService
  ) {}

  ngOnInit(): void {
    this.obtenerCatalogos();
    this.obtenerTipificaciones();
  }

  // Obtener todas las tipificaciones
  obtenerTipificaciones(): void {
    this.tipificacionService.obtenerTipificaciones().subscribe({
      next: (data) => this.tipificaciones = data,
      error: (err) => console.error('Error al cargar tipificaciones', err)
    });
  }

  crearCatalogo(): void {
    if (!this.nuevoCatalogo.nombre || !this.nuevoCatalogo.descripcion || !this.nuevoCatalogo.tipificacion_id) {
      alert('Todos los campos son obligatorios');
      return;
    }
  
    this.catalogoService.crearCatalogo(this.nuevoCatalogo).subscribe({
      next: () => {
        alert('Catálogo creado correctamente');
        this.obtenerCatalogos(); // actualiza la lista
        this.cerrarModalCreacion(); // cierra el modal
      },
      error: (err) => {
        console.error('Error al crear catálogo:', err);
      }
    });
  }
  

  // Obtener todos los catálogos
  obtenerCatalogos(): void {
    this.catalogoService.obtenerCatalogos().subscribe({
      next: (data) => this.catalogos = data,
      error: (err) => console.error('Error al cargar catálogos', err)
    });
  }

  // Eliminar un catálogo
  eliminarCatalogo(id: number): void {
    if (confirm('¿Estás seguro de eliminar este catálogo?')) {
      this.catalogoService.eliminarCatalogo(id).subscribe({
        next: () => {
          this.obtenerCatalogos(); // Refrescar la lista después de eliminar
        },
        error: (err) => {
          console.error('Error al eliminar catálogo:', err);
        }
      });
    }
  }

  abrirModalCreacion(): void {
    this.nuevoCatalogo = {}; // limpia el formulario
    this.mostrarModalCreacion = true;
  }
  
  cerrarModalCreacion(): void {
    this.mostrarModalCreacion = false;
    this.nuevoCatalogo = {};
  }
  

  // Abrir formulario para editar un catálogo
  abrirFormularioEdicion(catalogo: any): void {
    this.catalogoEdicion = { ...catalogo }; // Copiar los datos del catálogo a editar
    console.log('Catalogo para editar', this.catalogoEdicion);
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.catalogoEdicion = {}; // opcional: limpia el formulario
  }

  // Actualizar catálogo
  actualizarCatalogo(): void {
    if (!this.catalogoEdicion.id) {
      alert('Catálogo no válido');
      return;
    }
  
    const data = {
      ...this.catalogoEdicion,
      tipificacion_id: this.catalogoEdicion.tipificacion.id
    };
  
    this.catalogoService.actualizarCatalogo(this.catalogoEdicion.id, data).subscribe({
      next: () => {
        alert('Catálogo actualizado correctamente');
        this.obtenerCatalogos();
      },
      error: (err) => {
        console.error('Error al actualizar catálogo:', err);
      }
    });
  }
}
