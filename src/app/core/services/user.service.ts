import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api/users';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No hay token disponible. El usuario no está autenticado.');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Obtener todos los usuarios
  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // Crear un nuevo usuario
  createUser(user: any): Observable<any> {
    // Enviar también los roles en el cuerpo de la petición
    return this.http.post(this.apiUrl, user, { headers: this.getAuthHeaders() });
  }

  // Actualizar un usuario existente
  updateUser(user: any): Observable<any> {
    // Enviar también los roles en el cuerpo de la petición
    return this.http.put(`${this.apiUrl}/${user.id}`, user, { headers: this.getAuthHeaders() });
  }

  // Eliminar un usuario existente
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Servicio para buscar usuarios
  searchUsers(query: string): Observable<any> {
    const url = `${this.apiUrl}/search?query=${query}`;
    return this.http.get<any>(url, { headers: this.getAuthHeaders() });
  }

   // Obtener los roles del usuario
   getUserRoles(): Observable<any> {
    return this.http.get<any>('http://localhost:8000/api/me', { headers: this.getAuthHeaders() });
  }

  // Obtener los permisos del usuario
  getUserPermissions(): Observable<any> {
    return this.http.get<any>('http://localhost:8000/api/mis-permisos', { headers: this.getAuthHeaders() });
  }
}
