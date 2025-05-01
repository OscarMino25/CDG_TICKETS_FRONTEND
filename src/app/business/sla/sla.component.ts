import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SlaService } from '../../core/services/sla.service';

@Component({
  selector: 'app-sla',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sla.component.html',
})
export default class SlaComponent implements OnInit {
  slas: any[] = [];
  slaEdicion: any = null;

  constructor(private slaService: SlaService) {}

  ngOnInit(): void {
    this.obtenerSlas();
  }

  obtenerSlas(): void {
    this.slaService.getSlas().subscribe({
      next: (data) => this.slas = data,
      error: (err) => console.error('Error al cargar SLAs:', err),
    });
  }

  abrirFormularioCreacion(): void {
    this.slaEdicion = { nombre: '', tiempo_cliente: 0, tiempo_sistema: 0 };
  }

  abrirFormularioEdicion(sla: any): void {
    this.slaEdicion = { ...sla };
  }

  cancelarFormulario(): void {
    this.slaEdicion = null;
  }

  guardarSla(): void {
    const op = this.slaEdicion.id
      ? this.slaService.updateSla(this.slaEdicion.id, this.slaEdicion)
      : this.slaService.createSla(this.slaEdicion);

    op.subscribe({
      next: () => {
        this.obtenerSlas();
        this.slaEdicion = null;
      },
      error: (err) => console.error('Error al guardar SLA:', err)
    });
  }

  eliminarSla(id: number): void {
    if (confirm('¿Estás seguro de eliminar este SLA?')) {
      this.slaService.deleteSla(id).subscribe({
        next: () => this.obtenerSlas(),
        error: (err) => console.error('Error al eliminar SLA:', err)
      });
    }
  }
}
