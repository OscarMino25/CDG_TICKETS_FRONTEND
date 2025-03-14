import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Importar el servicio de autenticación

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiUrl = 'http://localhost:8000/api/roles';

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

  // Obtener todos los roles
  getRoles(): Observable<any> {
    return this.http.get(`${this.apiUrl}`, { headers: this.getAuthHeaders() });
  }

  // Crear un nuevo rol
  createRole(role: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, role, { headers: this.getAuthHeaders() });
  }

  // Eliminar un rol
  deleteRole(roleId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${roleId}`, { headers: this.getAuthHeaders() });
  }

  // Obtener permisos disponibles
  getPermissions(): Observable<any> {
    return this.http.get('http://localhost:8000/api/permissions', { headers: this.getAuthHeaders() });
  }

  // Asignar permisos a un rol
  assignPermissions(roleId: string, permissions: any[]): Observable<any> {
    return this.http.put(`/api/roles/${roleId}/permissions`, { permissions }, { headers: this.getAuthHeaders() });
  }

  // Actualizar un rol
  updateRole(roleId: string, roleData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${roleId}`, roleData, { headers: this.getAuthHeaders() });
  }

  // Obtener permisos de un rol específico
  getPermissionsForRole(roleId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${roleId}/permissions`, { headers: this.getAuthHeaders() });
  }
}
