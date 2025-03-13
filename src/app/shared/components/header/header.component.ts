import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  dropdownOpen = false;
  username: string = '';
  breadcrumb: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener el nombre del usuario desde el servicio AuthService
    this.authService.getCurrentUser().subscribe(user => {
      if (user && user.user) {
        this.username = user.user.name;  // Asigna el nombre del usuario al campo `username`
      } else {
        this.username = 'Usuario';  // Valor por defecto si no hay usuario
      }
    });

    // Actualizar el breadcrumb cuando la navegación cambie
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateBreadcrumb();
    });

    // Inicializa el breadcrumb cuando la página se carga por primera vez
    this.updateBreadcrumb();
  }

  private updateBreadcrumb(): void {
    const routes: string[] = [];
    let currentRoute: ActivatedRoute | null = this.activatedRoute.root;

    // Recorre las rutas activas para construir el breadcrumb
    while (currentRoute) {
      if (currentRoute.firstChild) {
        currentRoute = currentRoute.firstChild;

        // Si existe un valor en `breadcrumb` en los datos de la ruta, lo añadimos
        if (currentRoute.snapshot.data['breadcrumb']) {
          routes.push(currentRoute.snapshot.data['breadcrumb']);
        }
      } else {
        currentRoute = null;
      }
    }

    // Asigna el breadcrumb final
    this.breadcrumb = routes;
  }

  // Alterna el estado del dropdown (abierto o cerrado)
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Método para navegar al perfil
  navigateToProfile(): void {
    this.router.navigate(['/profile']);
    this.dropdownOpen = false; // Cerrar el dropdown al hacer clic en el perfil
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
