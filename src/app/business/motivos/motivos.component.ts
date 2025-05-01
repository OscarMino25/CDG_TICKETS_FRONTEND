import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MotivoService } from '../../core/services/motivo.service';
import { CatalogoService } from '../../core/services/catalogo.service';

@Component({
  selector: 'app-motivos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './motivos.component.html',
})
export default class MotivosComponent implements OnInit {
  motivos: any[] = [];
  catalogosFiltrados: any[] = [];

  mostrarModal = false;
  mostrarModalCreacion = false;

  nuevoMotivo = {
    nombre: '',
    catalogo_id: '',
  };

  motivoEdicion: any = {
    id: null,
    nombre: '',
    catalogo_id: '',
  };

  constructor(
    private motivoService: MotivoService,
    private catalogoService: CatalogoService
  ) {}

  ngOnInit(): void {
    this.obtenerMotivos();
    this.obtenerCatalogos();
  }

  obtenerMotivos() {
    this.motivoService.getMotivos().subscribe((data) => {
      this.motivos = data;
    });
  }

  obtenerCatalogos() {
    this.catalogoService.obtenerCatalogos().subscribe((data) => {
      this.catalogosFiltrados = data.filter(
        (cat: any) => cat.tipificacion_id === 2
      );
    });
  }

  // --- Crear Motivo ---
  abrirModalCreacion() {
    this.mostrarModalCreacion = true;
    this.nuevoMotivo = {
      nombre: '',
      catalogo_id: '',
    };
  }

  cerrarModalCreacion() {
    this.mostrarModalCreacion = false;
  }

  crearMotivo() {
    this.motivoService.createMotivo(this.nuevoMotivo).subscribe(() => {
      this.obtenerMotivos();
      this.cerrarModalCreacion();
    });
  }

  // --- Editar Motivo ---
  abrirFormularioEdicion(motivo: any) {
    this.mostrarModal = true;
    this.motivoEdicion = { ...motivo };
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.motivoEdicion = {
      id: null,
      nombre: '',
      catalogo_id: '',
    };
  }

  actualizarMotivo() {
    this.motivoService
      .updateMotivo(this.motivoEdicion.id, this.motivoEdicion)
      .subscribe(() => {
        this.obtenerMotivos();
        this.cerrarModal();
      });
  }

  // --- Eliminar ---
  eliminarMotivo(id: number) {
    if (confirm('¿Estás seguro de eliminar este motivo?')) {
      this.motivoService.deleteMotivo(id).subscribe(() => {
        this.obtenerMotivos();
      });
    }
  }
}
