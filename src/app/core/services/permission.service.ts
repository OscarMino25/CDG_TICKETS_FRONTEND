import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Importar el servicio de autenticación

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private apiUrl = 'http://localhost:8000/api/permissions'; // URL de permisos

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Obtener encabezados de autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No hay token disponible. El usuario no está autenticado.');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Obtener todos los permisos
  getPermissions(): Observable<any> {
    return this.http.get(`${this.apiUrl}`, { headers: this.getAuthHeaders() });
  }
}
