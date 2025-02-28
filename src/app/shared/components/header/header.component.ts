import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  dropdownOpen = false;
  username: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Obtener el nombre del usuario desde el servicio AuthService
    this.authService.getCurrentUser().subscribe(user => {
      if (user && user.user) {
        this.username = user.user.name;  // Asigna el nombre del usuario al campo `username`
      } else {
        this.username = 'Usuario';  // Valor por defecto si no hay usuario
      }
    });
  }

  // Alterna el estado del dropdown (abierto o cerrado)
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Cierra sesión y redirige al login
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);  // Redirige a la página de login
  }

  // Cierra el dropdown si se hace clic fuera del área
  @HostListener('document:click', ['$event'])
closeDropdown(event: MouseEvent): void {
  const target = event.target as HTMLElement; // Aserción de tipo

  if (target && !target.closest('.relative')) {  // Asegurándote de que target no sea null
    this.dropdownOpen = false;
  }
}
}
