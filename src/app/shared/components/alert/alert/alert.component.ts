import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../../core/services/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent implements OnInit {
  alert: { message: string, type: string } | null = null;

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.alertService.alert$.subscribe(alert => {
      console.log('Alerta recibida:', alert);// Verifica si el servicio está emitiendo correctamente las alertas
      this.alert = alert;
    });
  }
}