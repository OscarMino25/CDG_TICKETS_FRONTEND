import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MotivoService {
  private apiUrl = 'http://localhost:8000/api/motivos';

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

  // Obtener todos los motivos
  getMotivos(): Observable<any> {
    return this.http.get(`${this.apiUrl}`, { headers: this.getAuthHeaders() });
  }

  // Crear un nuevo motivo
  createMotivo(motivo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, motivo, { headers: this.getAuthHeaders() });
  }

  // Eliminar un motivo
  deleteMotivo(motivoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${motivoId}`, { headers: this.getAuthHeaders() });
  }

  // Actualizar un motivo
  updateMotivo(motivoId: number, motivoData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${motivoId}`, motivoData, { headers: this.getAuthHeaders() });
  }

  // Obtener un motivo específico por ID (opcional si lo usas)
  getMotivoById(motivoId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${motivoId}`, { headers: this.getAuthHeaders() });
  }
}
