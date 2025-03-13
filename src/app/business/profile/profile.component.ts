import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from '../../core/services/profile.service'; 
import { AlertService } from '../../core/services/alert.service'; // Importamos el servicio de alertas
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export default class ProfileComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  user: any;
  loading = false;
  passwordsMatch: boolean = true;
  alertSubscription: Subscription | null = null;

  private profileService = inject(ProfileService);
  private fb = inject(FormBuilder);
  public alertService = inject(AlertService); // Inyectamos el servicio de alertas

  constructor() {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]]
    });

    this.passwordForm = this.fb.group({
      current_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      new_password_confirmation: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();

    // Suscribirse a las alertas
    this.alertSubscription = this.alertService.alert$.subscribe(alert => {
      if (alert) {
        // Mostrar la alerta cuando se reciba
        console.log('Alerta:', alert);
      }
    });
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones al destruir el componente
    if (this.alertSubscription) {
      this.alertSubscription.unsubscribe();
    }
  }

  loadUserProfile() {
    this.profileService.getUserProfile().subscribe({
      next: (data) => {
        this.user = data.user;
        this.profileForm.patchValue({
          email: this.user.email,
          name: this.user.name 
        });
      },
      error: (err) => {
        console.error('Error al cargar el perfil', err);
      }
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      return;
    }
    this.loading = true;
    const updatedProfile = this.profileForm.value;

    this.profileService.updateProfile(updatedProfile).subscribe({
      next: (response) => {
        this.loading = false;
        this.alertService.showAlert('Perfil actualizado con éxito', 'success'); // Mostrar alerta de éxito
      },
      error: (error) => {
        this.loading = false;
        this.alertService.showAlert('Error al actualizar el perfil', 'error'); // Mostrar alerta de error
      }
    });
  }

  onChangePassword() {
    if (this.passwordForm.invalid || !this.passwordsMatch) {
      return;
    }
    this.loading = true;
    const passwordData = {
      current_password: this.passwordForm.get('current_password')?.value,
      new_password: this.passwordForm.get('new_password')?.value,
      new_password_confirmation: this.passwordForm.get('new_password_confirmation')?.value
    };
  
    this.profileService.changePassword(passwordData).subscribe({
      next: (response) => {
        this.loading = false;
        // Aquí puedes manejar lo que quieras después de un cambio exitoso
        this.alertService.showAlert('Contraseña cambiada exitosamente', 'success');
      },
      error: (error) => {
        this.loading = false;
        // Aquí se maneja el error y muestra el mensaje específico del backend
        const errorMessage = error?.error?.message || 'Error al cambiar la contraseña';
        this.alertService.showAlert(errorMessage, 'error');
      }
    });
  }
}
