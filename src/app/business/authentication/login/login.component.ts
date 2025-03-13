import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.errorMessage = null; // Resetear mensaje antes de intentar login

    this.authService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        console.error('Login failed', err);
        this.errorMessage = err.status === 401
          ? 'Credenciales inválidas. Inténtalo de nuevo.'
          : 'Error en el servidor. Inténtalo más tarde.';
      }
    });
  }

  closeAlert() {
    this.errorMessage = null;
  }
}
